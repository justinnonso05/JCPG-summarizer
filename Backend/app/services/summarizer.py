import requests
from bs4 import BeautifulSoup
from google import genai

async def summarize_text(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    text = soup.get_text(separator=" ", strip=True)

    client = genai.Client(api_key="AIzaSyCNVflqzF3wglnX3-1uc-lgjo36R89thCE")
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=f"Summarize this text, '{text}', it is the content of a we page. so let the summary be like you are telling the users about the webpage. Just start with the summary, no preambles or introductions. Just the summary. Then remove all linebreaks formatting and bold formatting"
    )

    return response.text

