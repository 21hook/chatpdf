import openai

openai.api_key = "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"

# Global variable to store the chat history
chat_history = []


# Call the openai API with gpt-3.5-turbo
# Give me a wrapper on this api calling
def call_gpt(prompt):
    # Include the chats in chat_history in the messages parameter
    messages = [
        {"role": chat["role"], "content": chat["content"]} for chat in chat_history
    ]
    messages.append({"role": "user", "content": prompt})

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=messages,
        temperature=0.7,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        # stream= True
    )
    answer = response.choices[0]

    # Add the new chat and the response to chat_history
    chat_history.append({"role": "user", "content": prompt})
    chat_history.append({"role": "assistant", "content": answer["message"]["content"]})

    # If the size of chat_history exceeds 10, remove the oldest chat
    while len(chat_history) > 10:
        chat_history.pop(0)

    return answer


# Test code:
# prompt = "What is the meaning of life?"
# print("Response:", call_gpt(prompt))


# Call the openai API with text-davinci-003
# Give me a wrapper on this api calling
def call_davinci(message):
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt="Summarize this text: " + message + ", and return the summary.",
        temperature=0.7,
        max_tokens=256,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
    )
    completion = response.choices[0]
    return completion


# Test code:
# text = 'Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter is one of the brightest objects visible to the naked eye in the night sky, and has been known to ancient civilizations since before recorded history. It is named after the Roman god Jupiter.[19] When viewed from Earth, Jupiter can be bright enough for its reflected light to cast visible shadows,[20] and is on average the third-brightest natural object in the night sky after the Moon and Venus.'
# print('Response: ', call_davinci(text))

# Fine-tune the GPT model with the prompt and answer
# response = openai.Classification.create
