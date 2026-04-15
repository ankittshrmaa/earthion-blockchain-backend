"""
Earthion Backend Configuration
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    # Go blockchain server URL
    GO_SERVER_URL: str = "http://localhost:8333"
    
    # API settings
    API_TITLE: str = "Earthion Blockchain API"
    API_VERSION: str = "1.0.0"
    
    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Request timeout (seconds)
    REQUEST_TIMEOUT: int = 30
    
    # Validation
    MAX_TX_AMOUNT: int = 1000000000  # 1 billion max
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
