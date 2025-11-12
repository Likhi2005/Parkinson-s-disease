import requests
import os

def test_backend():
    base_url = "http://127.0.0.1:5000"
    
    print("Testing backend connection...")
    
    try:
        # Test basic connection
        response = requests.get(f"{base_url}/", timeout=10)
        print("✓ Backend is reachable")
        print("Response:", response.json())
        
        # Test health endpoint
        health_response = requests.get(f"{base_url}/health", timeout=10)
        print("✓ Health check passed")
        print("Health:", health_response.json())
        
        # Test with a sample audio file (if you have one)
        test_audio_path = "uploads"  # Check if uploads folder exists
        if os.path.exists(test_audio_path):
            print("✓ Uploads folder exists")
        else:
            print("⚠ Uploads folder missing")
        
        return True
        
    except requests.exceptions.ConnectionError:
        print("✗ Cannot connect to backend. Is it running?")
        return False
    except requests.exceptions.Timeout:
        print("✗ Backend request timed out")
        return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    test_backend()