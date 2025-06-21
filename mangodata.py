from pymongo import MongoClient
import pandas as pd

# MongoDB connection string
client = MongoClient("mongodb+srv://chanukya714:sTMEbnsq2YUEGFwC@promptwise-cluster.wjpkuno.mongodb.net/?retryWrites=true&w=majority&appName=Promptwise-Cluster")
db = client["test"]
collection = db["conversations"]

# Fetch all conversations
conversations = collection.find()

# Flatten turns into individual rows
rows = []
for doc in conversations:
    convo_id = doc.get("conversationId")
    for turn in doc.get("turns", []):
        rows.append({
            "conversationId": convo_id,
            "turnIndex": turn.get("turnIndex"),
            "userPrompt": turn.get("userPrompt"),
            "optimisedPrompt": turn.get("optimisedPrompt"),
            "llmOutput": turn.get("llmOutput"),
            "timestamp": turn.get("timestamp")
        })

# Save to CSV
df = pd.DataFrame(rows)
df.to_csv("promptwise_export.csv", index=False)

print("✅ Exported to promptwise_export.csv")
