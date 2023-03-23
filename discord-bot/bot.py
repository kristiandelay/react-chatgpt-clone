import os
from dotenv import load_dotenv
load_dotenv()

import discord
from discord.ext import commands
import aiohttp
import json



intents = discord.Intents.default()
intents.typing = False
intents.presences = False

bot = commands.Bot(command_prefix='!', intents=intents)

async def api_request(url, method="GET", payload=None):
    async with aiohttp.ClientSession() as session:
        if method == "GET":
            async with session.get(url) as response:
                if response.content_type == "application/json":
                    return await response.json()
                else:
                    raise Exception(f"Unexpected content type: {response.content_type}")
        elif method == "POST":
            async with session.post(url, json=payload) as response:
                if response.content_type == "application/json":
                    return await response.json()
                else:
                    raise Exception(f"Unexpected content type: {response.content_type}")

            
@bot.event
async def on_ready():
    print(f'We have logged in as {bot.user}')

@bot.command()
async def ping(ctx):
    await ctx.send('Pong!')

@bot.command()
async def echo(ctx, *, message: str):
    await ctx.send(message)
    
@bot.command()
async def chat(ctx, *, prompt: str):
    try:
        # Replace with your API URL
        api_url = "http://localhost:420/api/chatgpt/question"

        payload = {
            "prompt": prompt,
            "chatId": "some_chat_id",  # Replace with a proper chat ID
        }

        response = await api_request(api_url, method="POST", payload=payload)
    # Log the response to the console
        print("API response:", response)

        audioName = response["audioName"]
        print("audioName:", audioName)
        
        if response.get("text"):
            text = response["text"]
            if len(text) > 2000:
                # Save the text as a file if it exceeds the 2000-character limit
                with open("response.txt", "w") as file:
                    file.write(text)

                # Send the text file as an attachment
                with open("response.txt", "rb") as file:
                    discord_file = discord.File(file, filename="response.txt")
                    await ctx.send("The response is too long. Sending as a text file:", file=discord_file)
            else:
                await ctx.send(text)

        if response.get("audioName"):
            audio_path = "/Users/kristian/lunarsoft/NODE/chatGPT/backend/" + response["audioName"]
                # Log the audio_path to the console
            print("Audio path:", audio_path)
            try:
                # Send the MP3 file as an attachment
                with open(audio_path, "rb") as file:
                    discord_file = discord.File(file, filename="response.mp3")
                    await ctx.send(file=discord_file)
            except FileNotFoundError:
                await ctx.send("There was an error loading the audio file.")
        else:
            await ctx.send("There was an error processing your request.")

    except Exception as e:
            error_message = f"An error occurred: {str(e)}"
            await ctx.send(error_message)
    
# @bot.command()
# async def chat(ctx, *, prompt: str):
#     # Replace with your API URL
#     api_url = "http://localhost:420/api/chatgpt/question"

#     payload = {
#         "prompt": prompt,
#         "chatId": "some_chat_id",  # Replace with a proper chat ID
#     }

#     response = await api_request(api_url, method="POST", payload=payload)

#     if response.get("text"):
#         await ctx.send(response["text"])
#     else:
#         await ctx.send("There was an error processing your request.")

bot_token = os.getenv('BOT_TOKEN')
bot.run(bot_token)
