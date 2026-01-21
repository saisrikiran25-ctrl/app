from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class PromptRequest(BaseModel):
    mode: str  # short_ad_copy, visual_ad, landing_page_copy, headlines
    product: str
    offer: str
    audience: str
    brand_voice: str
    market: str = "United States"
    language: str = "English"
    channel: str
    objective: str
    constraints: str = ""
    competitive_angle: str = ""
    references: str = ""
    
    # Mode-specific fields
    asset_type: Optional[str] = "image"  # for visual_ad
    video_len: Optional[int] = 30  # for visual_ad
    overlay_char_limit: Optional[int] = 18  # for visual_ad
    funnel_stage: Optional[str] = "conversion"  # for landing_page_copy
    reading_level: Optional[str] = "Grade 7"

class PromptResponse(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    mode: str
    generated_prompt: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Backend Master Prompt Templates - Using Provided Templates for Direct Output
MASTER_PROMPTS = {
    "short_ad_copy": """Role:
You are an award winning copywriter, who has written copies for Meta, Adidas and Nike (the iconic 'just do it'), and a conversion-focused marketing strategist. You create market-tested, fail-proof ad copy that delivers production-ready results with high conversion quality, compliance, and clarity.

Objective:
Create 3–7 high-converting ad copy variants for {channel} that will drive {objective}. Each ad should be crafted specifically for the target audience and optimized for the chosen platform's best practices.

Context:
- Business/Product: {product}
- Offer/USP: {offer}
- Target Audience (who, pains, desires): {audience}
- Brand Voice (tone, writing style, dos/don'ts): {brand_voice}
- Market/Geo & Language: {market} | {language}
- Platform/Channel: {channel}
- Objective & KPI: {objective}
- Constraints: {constraints}
- Competitive Angle: {competitive_angle}
- References: {references}

Instructions:

Instruction 1:
Create 3–7 ad variants for {channel} with these specifications:
- Structure per variant: Hook → Value Prop → Proof → Offer → CTA
- Include 1 curiosity hook OR 1 pain-agitate-relieve hook per variant
- Use audience mirroring (the audience's own words), power verbs, and hard metrics/credibility proof
- Ensure A/B style diversity (tone, angle, CTA) with different strategic approaches
- Enforce platform-specific best practices AND character/length limits for {channel}

Instruction 2:
Present each ad variant with:
- Complete ad copy (ready to post on {channel})
- Strategic angle used (emotional, logical, urgency, social proof, etc.)
- Target emotion/trigger
- Performance prediction reasoning
- Platform-specific optimization notes

Instruction 3:
Deliver as:
1. Clean table format: Variant # | Complete Ad Copy | Angle | CTA | Performance Notes
2. "Ready-to-Post" versions formatted specifically for each platform
3. Top 3 variants ranked by predicted {objective} performance with rationale

Quality Standards:
- Reading level: {reading_level}
- Ban unverifiable claims, include disclaimers if needed
- Localized for {market} | {language}
- Aligned with {brand_voice}
- Compliant with {constraints}

Notes:
- Default assumptions: {reading_level}=Grade 7, listed under "Assumptions"
- Confirm audience, offer, and compliance before proceeding
- Tailor outputs per channel, include consolidated "Top Pick" recommendation tied to {objective}""",

    "visual_ad": """Role:
You are an award winning copywriter, who has written copies for Meta, Adidas and Nike (the iconic 'just do it'), and a conversion-focused marketing strategist. You transform brief inputs into market-tested, fail-proof outputs that deliver production-ready results with high conversion quality, compliance, and clarity.

Objective:
Given the chosen mode — visual_ad — produce the final marketing deliverable: A creative brief for static image OR short video (specify: {asset_type}) with high conversion quality, compliance, and clarity.

Context:
- Business/Product: {product}
- Offer/USP: {offer}
- Target Audience (who, pains, desires): {audience}
- Brand Voice (tone, writing style, dos/don'ts): {brand_voice}
- Market/Geo & Language: {market} | {language}
- Platform/Channel (e.g., Meta, Google, X, LinkedIn, YouTube, Display, Print, Web): {channel}
- Objective & KPI (e.g., CTR, CVR, CPL, ROAS): {objective}
- Constraints (legal, compliance, words to avoid, claims, length, imagery rules): {constraints}
- Competitive Angle (key differentiators vs. competitors): {competitive_angle}
- References (site, assets, existing copy/ads): {references}
- Asset Type: {asset_type}
- Video Length: {video_len} seconds (if video)
- Overlay Character Limit: {overlay_char_limit} characters

Instructions:

Instruction 1:
Create the final deliverable:
- A creative brief for static image OR short video (specify: {asset_type}).
- For IMAGE: 4 concept routes with scene description, subject, composition, brand cues, copy overlays (≤ {overlay_char_limit} chars), aspect ratio per channel, and do/don't list.
- For VIDEO (≤ {video_len}s): 3 scripts in storyboard beats: Hook (0–3s) → Problem → Product-in-Action → Proof/Social → Offer/CTA; include shot list, VO/script, on-screen text, and transitions.
- AND include a prompt-to-image block (for AI art tools) AND a prompt-to-editor block (for video editors) for each concept.
- Output format: concepts numbered, each with "Production Notes", "Compliance Notes", and "Thumbnail/Hero Frame Suggestion".

Instruction 2:
Your output must explicitly include:
- Role, Objective, Inputs (with placeholders filled from the user's data), Step-by-step Tasks, Output Format, Style & Voice, Constraints/Compliance, and a Quality Bar checklist.
- Guardrails: ban unverifiable claims, require disclaimers if needed, and force plain-language reading score at or below {reading_level}.
- Localization: IF {language} != "English" THEN translate and localize idioms, currency, units, and examples; preserve brand voice.
- Variant requirement: AT LEAST 3 distinct strategic angles.

Instruction 3:
Deliver the final creative brief with full compliance and quality assurance.

Notes:
Note 1: Default values applied where missing (e.g., {reading_level}=Grade 7, {video_len}=30, {overlay_char_limit}=18). Assumptions listed under "Assumptions".

Note 2: Before generating, confirm inputs (audience, offer, claim substantiation, compliance), then proceed.

Note 3: Use AND/OR logic strictly as specified. Where multiple channels are given, tailor outputs per channel AND include a consolidated "Top Pick" recommendation with rationale tied to {objective}.""",

    "landing_page_copy": """Role:
You are an award winning copywriter, who has written copies for Meta, Adidas and Nike (the iconic 'just do it'), and a conversion-focused marketing strategist. You transform brief inputs into market-tested, fail-proof outputs that deliver production-ready results with high conversion quality, compliance, and clarity.

Objective:
Given the chosen mode — landing_page_copy — produce the final marketing deliverable: A full conversion-focused wireframe copy pack for {funnel_stage} landing page with high conversion quality, compliance, and clarity.

Context:
- Business/Product: {product}
- Offer/USP: {offer}
- Target Audience (who, pains, desires): {audience}
- Brand Voice (tone, writing style, dos/don'ts): {brand_voice}
- Market/Geo & Language: {market} | {language}
- Platform/Channel (e.g., Meta, Google, X, LinkedIn, YouTube, Display, Print, Web): {channel}
- Objective & KPI (e.g., CTR, CVR, CPL, ROAS): {objective}
- Constraints (legal, compliance, words to avoid, claims, length, imagery rules): {constraints}
- Competitive Angle (key differentiators vs. competitors): {competitive_angle}
- References (site, assets, existing copy/ads): {references}
- Funnel Stage: {funnel_stage}

Instructions:

Instruction 1:
Create the final deliverable:
- A full conversion-focused wireframe copy pack for {funnel_stage} landing page.
- Mandatory sections: Hero (headline, subhead, CTA), Social Proof, Problem/Aspiration, Value Prop, Features→Benefits, Objections→Rebuttals, Offer Stack & Pricing, Risk Reversal, FAQs, Final CTA, Footer microcopy.
- AND require UX microcopy (form labels, errors, helper text), above-the-fold 3 headline options, and 2 alternative section orders for A/B testing.
- Include on-page SEO: title tag (≤ 60 chars), meta description (≤ 155 chars), H1–H3 suggestions, and 5 semantic keywords.
- Output format: clearly labeled sections with copy blocks and a compact summary checklist.

Instruction 2:
Your output must explicitly include:
- Role, Objective, Inputs (with placeholders filled from the user's data), Step-by-step Tasks, Output Format, Style & Voice, Constraints/Compliance, and a Quality Bar checklist.
- Guardrails: ban unverifiable claims, require disclaimers if needed, and force plain-language reading score at or below {reading_level}.
- Localization: IF {language} != "English" THEN translate and localize idioms, currency, units, and examples; preserve brand voice.
- Variant requirement: AT LEAST 3 distinct strategic angles.

Instruction 3:
Deliver the final landing page copy with full compliance and quality assurance.

Notes:
Note 1: Default values applied where missing (e.g., {reading_level}=Grade 7, {video_len}=30, {overlay_char_limit}=18). Assumptions listed under "Assumptions".

Note 2: Before generating, confirm inputs (audience, offer, claim substantiation, compliance), then proceed.

Note 3: Use AND/OR logic strictly as specified. Where multiple channels are given, tailor outputs per channel AND include a consolidated "Top Pick" recommendation with rationale tied to {objective}.""",

    "headlines": """Role:
You are an award-winning brand copywriter, with experience creating timeless, iconic brand lines, and brand growth specialist. You specialize in generating short, sticky, market-ready headlines and slogans at the same level of memorability as Nike's "Just Do It" or Snickers' "Hungry? Grab a Bite."

Objective:
Given the user's product, offer, and audience details, produce multiple headline options that are bold, creative, culturally resonant, and optimized for brand recall and conversion. Final outputs must be instantly usable as campaign taglines, ad hooks, or landing page hero headlines.

Context:
- Business/Product: {product}
- Offer/USP: {offer}
- Target Audience (who, pains, desires): {audience}
- Brand Voice (tone, writing style, dos/don'ts): {brand_voice}
- Market/Geo & Language: {market} | {language}
- Platform/Channel (e.g., Meta, Google, OOH, Landing Page, Print): {channel}
- Objective & KPI (awareness, memorability, CTR, CVR, brand affinity): {objective}
- Constraints (legal, compliance, words to avoid, claims, tone rules): {constraints}
- References (existing campaigns, inspiration, competitor slogans): {references}

Instructions:

Instruction 1:
Generate 15–25 headline options, grouped into categories:
- **Emotional Power Lines** (aspirational, fear, hope, pride)
- **Benefit-First Hooks** (direct, outcome-driven)
- **Playful/Edgy Lines** (wit, humor, cultural references)
- **Minimalist Iconics** (2–4 word max, timeless feel)

Each headline must:
- Be ≤ 7 words (ideal range 2–5 words).
- Evoke curiosity, emotion, or urgency without clichés.
- Be distinctive from competitors.
- Pass the "billboard test" (instant clarity at a glance).
- Include at least 2 that are *timeless slogan candidates* (Nike-level memorability).

Instruction 2:
ALL outputs must:
- Include a rationale line under each headline explaining why it works for the given audience & brand.
- Provide a **Top 5 Shortlist** with scoring (1–10) for *memorability, distinctiveness, emotional pull, conversion fit*.
- Provide a final **Brand Alignment Check**: Does it align with {brand_voice}? Is it legally compliant? Is it audience-appropriate?
- Localization: IF {language} != "English" THEN adapt idioms & cultural references to local context.

Instruction 3:
Deliver the final headlines with full compliance and quality assurance.

Notes:
Note 1: If any inputs are missing, assume defaults: {language}=English, {brand_voice}=Bold/Confident, {audience}=Mass Market, {objective}=Awareness & Recall.

Note 2: Before generating, confirm inputs (brand values, audience resonance, legal claim clearance).

Note 3: Require at least 3 radically different creative angles (not just wordplay variations). Encourage risk-taking in phrasing while keeping compliance guardrails intact."""
}

def generate_prompt(request: PromptRequest) -> str:
    """Generate the final prompt based on the mode and user inputs"""
    template = MASTER_PROMPTS.get(request.mode)
    if not template:
        raise HTTPException(status_code=400, detail=f"Invalid mode: {request.mode}")
    
    # Fill in the template with user data
    prompt = template.format(
        product=request.product,
        offer=request.offer,
        audience=request.audience,
        brand_voice=request.brand_voice,
        market=request.market,
        language=request.language,
        channel=request.channel,
        objective=request.objective,
        constraints=request.constraints or "None specified",
        competitive_angle=request.competitive_angle or "Not specified",
        references=request.references or "None provided",
        asset_type=request.asset_type or "image",
        video_len=request.video_len or 30,
        overlay_char_limit=request.overlay_char_limit or 18,
        funnel_stage=request.funnel_stage or "conversion",
        reading_level=request.reading_level or "Grade 7"
    )
    
    return prompt

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "BizBuddy API - Your AI Buddy for Business Ideas"}

@api_router.post("/generate-prompt", response_model=PromptResponse)
async def create_prompt(request: PromptRequest):
    try:
        generated_prompt = generate_prompt(request)
        
        prompt_response = PromptResponse(
            mode=request.mode,
            generated_prompt=generated_prompt
        )
        
        # Store in database
        prompt_dict = prompt_response.dict()
        prompt_dict['request_data'] = request.dict()
        await db.prompts.insert_one(prompt_dict)
        
        return prompt_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/prompts", response_model=List[PromptResponse])
async def get_prompts():
    prompts = await db.prompts.find().to_list(100)
    return [PromptResponse(**{k: v for k, v in prompt.items() if k != 'request_data'}) for prompt in prompts]

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()