"""
Database connection and utilities for Supabase.
"""

from supabase import create_client, Client
from app.core.config import settings


class SupabaseClient:
    """Supabase client wrapper."""
    
    def __init__(self):
        self._client: Client = None
        self._service_client: Client = None
    
    @property
    def client(self) -> Client:
        """Get the regular Supabase client (with anon key)."""
        if self._client is None:
            self._client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_ANON_KEY
            )
        return self._client
    
    @property
    def service_client(self) -> Client:
        """Get the service role Supabase client (with service key)."""
        if self._service_client is None:
            self._service_client = create_client(
                settings.SUPABASE_URL,
                settings.SUPABASE_SERVICE_ROLE_KEY
            )
        return self._service_client


# Global instance
supabase_client = SupabaseClient()


def get_supabase() -> Client:
    """Get Supabase client dependency."""
    return supabase_client.client


def get_supabase_service() -> Client:
    """Get Supabase service client dependency."""
    return supabase_client.service_client
