import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import * as db from './server/db';
import * as agent from './server/agent';
import * as notifications from './server/notifications';
import { resolveExactProductImage, getProductImageUrl, resolveExactProductSource } from './server/productImages';

dotenv.config();

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

// Initialize database
db.initDb();

// ---------- API Routes ----------

// Exact Product Source & Direct Link Lookup
app.get('/api/product-source', async (req, res) => {
  const q = String(req.query.q || '');
  if (!q) {
    return res.status(400).json({ error: 'q is required' });
  }
  const source = await resolveExactProductSource(q);
  res.json(source);
});

// Exact Product Image Lookup
app.get('/api/product-image', async (req, res) => {
  const q = String(req.query.q || '');
  if (!q) {
    return res.json({ url: getProductImageUrl('') });
  }
  const url = await resolveExactProductImage(q);
  res.json({ url });
});

// Stats
app.get('/api/stats', (req, res) => {
  const userId = (req.query.user_id as string) || 'default';
  const prefs = db.getPreferences(userId);
  const prefCount = Object.keys(prefs).filter(k => !k.startsWith('_')).length;
  const tracked = db.listTrackedProducts(userId);
  const totalChecks = tracked.reduce((sum, p) => sum + db.getPriceHistory(p.id).length, 0);

  res.json({
    tracked_count: tracked.length,
    total_checks: totalChecks,
    pref_count: prefCount,
    onboarding_dismissed: prefs['_onboarding_dismissed'] === 'true',
  });
});

// Preferences
app.get('/api/preferences', (req, res) => {
  const userId = (req.query.user_id as string) || 'default';
  const prefs = db.getPreferences(userId);
  res.json(prefs);
});

app.post('/api/preferences', (req, res) => {
  const { user_id, key, value } = req.body;
  if (!user_id || !key) {
    return res.status(400).json({ error: 'user_id and key are required' });
  }
  db.setPreference(user_id, key, value || '');
  res.json({ success: true, preferences: db.getPreferences(user_id) });
});

app.delete('/api/preferences', (req, res) => {
  const { user_id, key } = req.body;
  if (!user_id || !key) {
    return res.status(400).json({ error: 'user_id and key are required' });
  }
  db.deletePreference(user_id, key);
  res.json({ success: true, preferences: db.getPreferences(user_id) });
});

// Notification settings & test
app.post('/api/notifications/settings', (req, res) => {
  const { user_id, email, telegram_chat_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required' });
  }
  if (email !== undefined) {
    db.setPreference(user_id, 'notify_email', email);
  }
  if (telegram_chat_id !== undefined) {
    db.setPreference(user_id, 'notify_telegram_chat_id', telegram_chat_id);
  }
  res.json({ success: true, preferences: db.getPreferences(user_id) });
});

app.post('/api/notifications/test', async (req, res) => {
  const { user_id } = req.body;
  const userId = user_id || 'default';
  const results = await notifications.notifyPriceAlert(
    userId,
    'Test Alert — Vantage Shopping Assistant',
    'This is a test alert. If you received this, your price notification settings are working properly!'
  );
  res.json({ success: true, results });
});

// Tracked Products
app.get('/api/products', (req, res) => {
  const userId = (req.query.user_id as string) || 'default';
  const products = db.listTrackedProducts(userId);
  const enriched = products.map(p => {
    const history = db.getPriceHistory(p.id);
    const lowest = db.getLowestPrice(p.id);
    const latestCheck = history.length > 0 ? history[history.length - 1] : null;
    return {
      ...p,
      history,
      lowest_price: lowest,
      current_price: latestCheck ? latestCheck.price : null,
      latest_check: latestCheck,
    };
  });
  res.json(enriched);
});

app.post('/api/products', (req, res) => {
  const { user_id, name, search_query, target_price } = req.body;
  if (!user_id || !name || !search_query) {
    return res.status(400).json({ error: 'user_id, name, and search_query are required' });
  }
  const parsedTarget = target_price ? parseFloat(target_price) : null;
  const prod = db.addTrackedProduct(user_id, name, search_query, parsedTarget);
  res.json({ success: true, product: prod });
});

app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product id' });
  }
  db.removeTrackedProduct(id);
  res.json({ success: true });
});

app.get('/api/products/:id/history', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product id' });
  }
  const history = db.getPriceHistory(id);
  const lowest = db.getLowestPrice(id);
  res.json({ history, lowest });
});

// Check price for single product
app.post('/api/products/:id/check', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const userId = (req.body.user_id as string) || 'default';
  const products = db.listTrackedProducts(userId);
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const checkResult = await agent.checkCurrentPrice(product.search_query);
  const price = checkResult.price;

  let alert = false;
  let alertMessage = '';
  let notificationResults: notifications.NotificationResult[] = [];

  if (price !== null && !isNaN(price)) {
    const lowestBefore = db.getLowestPrice(product.id);
    db.recordPriceCheck(
      product.id,
      price,
      checkResult.source_url || '',
      checkResult.note || ''
    );

    if (product.target_price && price <= product.target_price) {
      alert = true;
      alertMessage = `🎉 Price ₹${price.toLocaleString('en-IN')} is at or below your target of ₹${product.target_price.toLocaleString('en-IN')}!`;
    } else if (lowestBefore !== null && price < lowestBefore) {
      alert = true;
      alertMessage = `📉 New lowest price seen: ₹${price.toLocaleString('en-IN')} (previous lowest: ₹${lowestBefore.toLocaleString('en-IN')})`;
    }

    if (alert) {
      notificationResults = await notifications.notifyPriceAlert(
        userId,
        product.name,
        alertMessage
      );
    }
  }

  const history = db.getPriceHistory(product.id);
  const lowest = db.getLowestPrice(product.id);

  res.json({
    success: true,
    price,
    source_url: checkResult.source_url,
    note: checkResult.note,
    alert,
    alertMessage,
    notifications: notificationResults,
    history,
    lowest,
  });
});

// Chat Endpoint
app.post('/api/chat', async (req, res) => {
  const { user_id, message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }
  const userId = user_id || 'default';
  try {
    const reply = await agent.askAssistant(userId, message, history || []);
    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Chat generation failed' });
  }
});

// Multi-Source Research Endpoint
app.post('/api/research/multi', async (req, res) => {
  const { user_id, goal } = req.body;
  if (!goal) {
    return res.status(400).json({ error: 'goal is required' });
  }
  const userId = user_id || 'default';
  try {
    const result = await agent.multiSourceResearch(userId, goal);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Research failed' });
  }
});

// ---------- Vite / Static Setup ----------

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`[Vantage] Server running on http://${HOST}:${PORT}`);
  });
}

startServer();
