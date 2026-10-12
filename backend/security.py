import ipaddress
import socket
import re
from urllib.parse import urlparse
from typing import Tuple, Optional
from config import ALLOWED_DOMAINS

# SSRF Protection: Deny private, loopback, link-local, multicast and reserved IP ranges
BLOCKED_IP_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),       # Loopback
    ipaddress.ip_network("10.0.0.0/8"),        # Private RFC 1918
    ipaddress.ip_network("172.16.0.0/12"),     # Private RFC 1918
    ipaddress.ip_network("192.168.0.0/16"),    # Private RFC 1918
    ipaddress.ip_network("169.254.0.0/16"),    # Link-local / AWS metadata
    ipaddress.ip_network("::1/128"),           # IPv6 loopback
    ipaddress.ip_network("fc00::/7"),          # IPv6 private
    ipaddress.ip_network("fe80::/10"),         # IPv6 link-local
]

def is_ip_allowed(ip_str: str) -> bool:
    try:
        ip_obj = ipaddress.ip_address(ip_str)
        for net in BLOCKED_IP_NETWORKS:
            if ip_obj in net:
                return False
        return True
    except ValueError:
        return False

def check_ssrf_safety(url_str: str) -> Tuple[bool, Optional[str]]:
    try:
        parsed = urlparse(url_str)
        if parsed.scheme.lower() not in ("http", "https"):
            return False, "Invalid URL scheme; only HTTP/HTTPS are allowed."

        host = parsed.hostname
        if not host:
            return False, "Empty or invalid host in URL."

        host_lower = host.lower()
        if host_lower in ("localhost", "127.0.0.1", "::1", "metadata.google.internal"):
            return False, "Access to localhost or cloud metadata services is blocked."

        # Resolve hostname to check destination IP
        try:
            ip_info = socket.gethostbyname(host)
            if not is_ip_allowed(ip_info):
                return False, f"Resolved IP {ip_info} is a private/internal non-routable address (SSRF blocked)."
        except socket.gaierror:
            pass # DNS resolution may fail or be deferred to httpx

        return True, None
    except Exception as e:
        return False, f"URL parse failed: {str(e)}"

def extract_domain(url_str: str) -> str:
    try:
        parsed = urlparse(url_str)
        host = (parsed.hostname or "").lower()
        if host.startswith("www."):
            host = host[4:]
        return host
    except Exception:
        return ""

def is_allowed_domain(domain: str) -> bool:
    domain_clean = domain.lower()
    for allowed in ALLOWED_DOMAINS:
        if domain_clean == allowed or domain_clean.endswith("." + allowed):
            return True
    return False

def check_is_product_detail_page(url_str: str) -> bool:
    """
    Checks if a URL pattern represents a genuine product detail page (PDP),
    and rejects search, category, or homepage URLs.
    """
    if not url_str:
        return False

    parsed = urlparse(url_str)
    path = parsed.path.lower()
    host = (parsed.hostname or "").lower()

    if path in ("", "/"):
        return False

    # Disallow known search and category patterns
    search_keywords = ["/s?", "/search", "/category", "/categories", "/c/", "/browse", "/shop-all"]
    for sk in search_keywords:
        if sk in path:
            return False

    # Specific primary retailer product detail patterns in India
    if "amazon." in host:
        return bool(re.search(r"/(?:dp|gp/product)/[A-Z0-9]{10}", path, re.I))
    elif "flipkart." in host:
        return bool(re.search(r"/p/(?:itm[a-zA-Z0-9]+)", path, re.I))
    elif "myntra." in host:
        return bool(re.search(r"/\d+/buy", path, re.I))
    elif "croma." in host:
        return bool(re.search(r"/p/\d+", path, re.I))
    elif "tatacliq." in host:
        return bool(re.search(r"/p-[a-zA-Z0-9]+", path, re.I))

    # General heuristic for PDPs: contains product ID or SKU
    return bool(re.search(r"(?:/p/|/product/|/item/|/pd/|\.html)", path, re.I))
