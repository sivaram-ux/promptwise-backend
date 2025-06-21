import requests

BASE_URL = "https://promptwise-backend.onrender.com"

# Step 1: Start a new conversation
def start_conversation():
    payload = {
        "userPrompt": "What is artificial intelligence?",
        "optimisedPrompt": "Explain the concept of artificial intelligence in simple terms.",
        "llmOutput": "Artificial intelligence (AI) refers to machines that mimic human cognitive functions..."
    }

    response = requests.post(f"{BASE_URL}/api/conversation/start", json=payload)
    if response.status_code == 200:
        data = response.json()
        print("✅ New conversation started.")
        print("Conversation ID:", data["conversationId"])
        return data["conversationId"]
    else:
        print("❌ Failed to start conversation:", response.text)
        return None

# Step 2: Append a new turn to the conversation
def append_turn(conversation_id):
    payload = {
        "userPrompt": "How is AI used in daily life?",
        "optimisedPrompt": "List real-world applications of AI in everyday scenarios.",
        "llmOutput": "AI is used in voice assistants, personalized recommendations, smart devices, etc."
    }

    response = requests.patch(f"{BASE_URL}/api/conversation/{conversation_id}/append", json=payload)
    if response.status_code == 200:
        print("✅ Turn appended successfully.")
    else:
        print("❌ Failed to append turn:", response.text)

# Run the test flow
if __name__ == "__main__":
    conversation_id = start_conversation()
    if not conversation_id:
        append_turn(conversation_id)
