import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select";
import { Label } from "./components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import { Copy, Check, Zap, Target, PenTool, Megaphone, ArrowRight, Sparkles, Bot, Rocket } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  const navigate = useNavigate();
  
  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                BizBuddy
              </span>
            </div>
            <div className="hidden md:flex space-x-6">
              <Button variant="ghost" onClick={() => navigate('/')}>Home</Button>
              <Button variant="ghost" onClick={() => navigate('/modes')}>Modes</Button>
              <Button variant="ghost" onClick={() => navigate('/about')}>About</Button>
            </div>
          </div>
          <div className="flex items-center">
            <Button onClick={() => navigate('/modes')} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
              Start Building <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Homepage Component
const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-indigo-100 text-indigo-700 px-4 py-2 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-Powered Business Prompts
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Your AI Buddy for
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent block">
                  Business Ideas
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Transform your raw business ideas into structured, production-ready prompts that generate 
                amazing ad copy, landing pages, visuals, and headlines with ChatGPT.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/modes')}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Start Building Prompt
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/about')}
                className="px-8 py-3 border-2 border-indigo-200 hover:border-indigo-300 text-indigo-700 font-semibold rounded-xl"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What BizBuddy Does */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">What BizBuddy Does</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Convert your business ideas into structured markdown prompts that ChatGPT transforms into market-ready assets
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <PenTool className="h-8 w-8 text-indigo-600" />,
                title: "Short Ad Copy",
                description: "Generate compelling ad variants optimized for different platforms with A/B testing insights"
              },
              {
                icon: <Target className="h-8 w-8 text-purple-600" />,
                title: "Visual Ads",
                description: "Create detailed creative briefs for static images and video ads with production notes"
              },
              {
                icon: <Zap className="h-8 w-8 text-green-600" />,
                title: "Landing Page Copy",
                description: "Build conversion-focused wireframe copy packs with SEO optimization and A/B variants"
              },
              {
                icon: <Megaphone className="h-8 w-8 text-orange-600" />,
                title: "Headlines",
                description: "Craft memorable, iconic headlines and slogans that rival Nike's 'Just Do It' level"
              }
            ].map((feature, index) => (
              <Card key={index} className="relative group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple 4-step process to transform your ideas into production-ready marketing assets
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Choose Mode", desc: "Select from 4 specialized prompt types" },
              { step: "2", title: "Enter Details", desc: "Input your business info in our smart form" },
              { step: "3", title: "Get Prompt", desc: "Receive structured markdown prompt instantly" },
              { step: "4", title: "Paste & Generate", desc: "Copy to ChatGPT and get your assets" }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Ready to Build Your Perfect Prompt?
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of entrepreneurs who are already using BizBuddy to create better marketing assets
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/modes')}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start Building Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">BizBuddy</span>
            </div>
            <p className="text-gray-400">© 2025 BizBuddy. All rights reserved.</p>
            <div className="flex justify-center space-x-6 text-sm text-gray-400">
              <span className="hover:text-white cursor-pointer">Terms</span>
              <span className="hover:text-white cursor-pointer">Privacy</span>
              <span className="hover:text-white cursor-pointer">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Mode Selection Page
const ModesPage = () => {
  const navigate = useNavigate();
  
  const modes = [
    {
      id: "short_ad_copy",
      title: "Short Ad Copy",
      description: "Generate 3-7 compelling ad variants optimized for different platforms with CTR predictions and A/B testing insights",
      icon: <PenTool className="h-8 w-8 text-indigo-600" />,
      color: "from-indigo-600 to-indigo-700",
      features: ["Platform-specific optimization", "A/B testing variants", "CTR predictions", "Ready-to-post formats"]
    },
    {
      id: "visual_ad",
      title: "Visual Ads",
      description: "Create detailed creative briefs for static images or video ads with production notes and AI art prompts",
      icon: <Target className="h-8 w-8 text-purple-600" />,
      color: "from-purple-600 to-purple-700",
      features: ["Image & video concepts", "Production notes", "AI art prompts", "Storyboard beats"]
    },
    {
      id: "landing_page_copy",
      title: "Landing Page Copy",
      description: "Build conversion-focused wireframe copy packs with SEO optimization, UX microcopy, and testing variants",
      icon: <Zap className="h-8 w-8 text-green-600" />,
      color: "from-green-600 to-green-700",
      features: ["Full page wireframes", "SEO optimization", "UX microcopy", "A/B testing layouts"]
    },
    {
      id: "headlines",
      title: "Headlines",
      description: "Craft 15-25 memorable, iconic headlines and slogans with Nike-level memorability and brand recall scoring",
      icon: <Megaphone className="h-8 w-8 text-orange-600" />,
      color: "from-orange-600 to-orange-700",
      features: ["15-25 headline options", "Memorability scoring", "Brand alignment checks", "Cultural localization"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Choose Your Mode</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the type of marketing asset you want to create. Each mode generates specialized prompts 
            optimized for different business outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {modes.map((mode) => (
            <Card key={mode.id} className="relative group hover:shadow-2xl transition-all duration-300 border-0 bg-white overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              <CardHeader className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    {mode.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{mode.title}</CardTitle>
                </div>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {mode.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Key Features:</h4>
                  <ul className="space-y-1">
                    {mode.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  onClick={() => navigate(`/builder?mode=${mode.id}`)}
                  className={`w-full bg-gradient-to-r ${mode.color} hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-white font-semibold`}
                >
                  Select {mode.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

// Prompt Builder Page
const PromptBuilderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryParams = new URLSearchParams(location.search);
  const selectedMode = queryParams.get('mode') || 'short_ad_copy';
  
  const [formData, setFormData] = useState({
    mode: selectedMode,
    product: '',
    offer: '',
    audience: '',
    brand_voice: '',
    market: 'United States',
    language: 'English',
    channel: '',
    objective: '',
    constraints: '',
    competitive_angle: '',
    references: '',
    asset_type: 'image',
    video_len: 30,
    overlay_char_limit: 18,
    funnel_stage: 'conversion',
    reading_level: 'Grade 7'
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.product || !formData.offer || !formData.audience || !formData.brand_voice || !formData.channel || !formData.objective) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields marked with *",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/generate-prompt`, formData);
      navigate(`/result?id=${response.data.id}`, { 
        state: { promptData: response.data } 
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getModeTitle = (mode) => {
    const titles = {
      'short_ad_copy': 'Short Ad Copy',
      'visual_ad': 'Visual Ads',
      'landing_page_copy': 'Landing Page Copy',
      'headlines': 'Headlines'
    };
    return titles[mode] || mode;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-indigo-100 text-indigo-700 px-4 py-2">
            {getModeTitle(selectedMode)}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Build Your Prompt</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Fill in your business details below to generate a structured prompt that ChatGPT can use 
            to create professional marketing assets.
          </p>
        </div>

        <Card className="bg-white shadow-xl border-0">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-6 mt-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="product">Business/Product *</Label>
                      <Textarea
                        id="product"
                        placeholder="Describe your business, product, or service..."
                        value={formData.product}
                        onChange={(e) => handleInputChange('product', e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="offer">Offer/USP *</Label>
                      <Textarea
                        id="offer"
                        placeholder="What's your unique selling proposition or main offer?"
                        value={formData.offer}
                        onChange={(e) => handleInputChange('offer', e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience *</Label>
                    <Textarea
                      id="audience"
                      placeholder="Who are your customers? What are their pains, desires, and characteristics?"
                      value={formData.audience}
                      onChange={(e) => handleInputChange('audience', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand_voice">Brand Voice *</Label>
                    <Textarea
                      id="brand_voice"
                      placeholder="Describe your brand tone, writing style, dos and don'ts..."
                      value={formData.brand_voice}
                      onChange={(e) => handleInputChange('brand_voice', e.target.value)}
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="channel">Platform/Channel *</Label>
                      <Input
                        id="channel"
                        placeholder="e.g., Meta, Google, LinkedIn, YouTube..."
                        value={formData.channel}
                        onChange={(e) => handleInputChange('channel', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="objective">Objective & KPI *</Label>
                      <Input
                        id="objective"
                        placeholder="e.g., CTR, CVR, ROAS, Brand Awareness..."
                        value={formData.objective}
                        onChange={(e) => handleInputChange('objective', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6 mt-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="market">Market/Geography</Label>
                      <Select value={formData.market} onValueChange={(value) => handleInputChange('market', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select market" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">United States</SelectItem>
                          <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="France">France</SelectItem>
                          <SelectItem value="Global">Global</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Portuguese">Portuguese</SelectItem>
                          <SelectItem value="Italian">Italian</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="constraints">Constraints</Label>
                    <Textarea
                      id="constraints"
                      placeholder="Legal requirements, compliance rules, words to avoid, length limits..."
                      value={formData.constraints}
                      onChange={(e) => handleInputChange('constraints', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competitive_angle">Competitive Angle</Label>
                    <Textarea
                      id="competitive_angle"
                      placeholder="Key differentiators vs. competitors..."
                      value={formData.competitive_angle}
                      onChange={(e) => handleInputChange('competitive_angle', e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="references">References</Label>
                    <Textarea
                      id="references"
                      placeholder="Existing websites, assets, copy examples, or inspiration..."
                      value={formData.references}
                      onChange={(e) => handleInputChange('references', e.target.value)}
                      rows={3}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6 mt-8">
                  {selectedMode === 'visual_ad' && (
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="asset_type">Asset Type</Label>
                          <Select value={formData.asset_type} onValueChange={(value) => handleInputChange('asset_type', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="video_len">Video Length (seconds)</Label>
                          <Input
                            id="video_len"
                            type="number"
                            value={formData.video_len}
                            onChange={(e) => handleInputChange('video_len', parseInt(e.target.value))}
                            min="15"
                            max="180"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="overlay_char_limit">Overlay Character Limit</Label>
                          <Input
                            id="overlay_char_limit"
                            type="number"
                            value={formData.overlay_char_limit}
                            onChange={(e) => handleInputChange('overlay_char_limit', parseInt(e.target.value))}
                            min="10"
                            max="50"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMode === 'landing_page_copy' && (
                    <div className="space-y-2">
                      <Label htmlFor="funnel_stage">Funnel Stage</Label>
                      <Select value={formData.funnel_stage} onValueChange={(value) => handleInputChange('funnel_stage', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="awareness">Awareness</SelectItem>
                          <SelectItem value="consideration">Consideration</SelectItem>
                          <SelectItem value="conversion">Conversion</SelectItem>
                          <SelectItem value="retention">Retention</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="reading_level">Reading Level</Label>
                    <Select value={formData.reading_level} onValueChange={(value) => handleInputChange('reading_level', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Grade 5">Grade 5</SelectItem>
                        <SelectItem value="Grade 7">Grade 7</SelectItem>
                        <SelectItem value="Grade 9">Grade 9</SelectItem>
                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                        <SelectItem value="College">College</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-center pt-8">
                <Button 
                  type="submit" 
                  disabled={loading}
                  size="lg"
                  className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Prompt
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Result Page
const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const promptData = location.state?.promptData;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promptData.generated_prompt);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard. Paste it in ChatGPT!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  if (!promptData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No prompt data found</h1>
          <Button onClick={() => navigate('/modes')}>Back to Modes</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-12">
          <Badge className="bg-green-100 text-green-700 px-4 py-2">
            <Check className="h-4 w-4 mr-2" />
            Prompt Generated Successfully
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Your Markdown Prompt</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Copy the prompt below and paste it directly into ChatGPT to generate your marketing assets
          </p>
        </div>

        <Card className="bg-white shadow-2xl border-0">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Generated Prompt - {promptData.mode.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </CardTitle>
              <Button
                onClick={copyToClipboard}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt
                  </>
                )}
              </Button>
            </div>
            <CardDescription className="text-gray-600">
              This structured prompt is ready to paste into ChatGPT for immediate use
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed overflow-x-auto">
                {promptData.generated_prompt}
              </pre>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                <li>Copy the prompt above using the "Copy Prompt" button</li>
                <li>Open ChatGPT in a new tab</li>
                <li>Paste the entire prompt into ChatGPT</li>
                <li>Press Enter and watch your marketing assets get generated!</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-y-4">
          <Button 
            onClick={() => navigate('/modes')}
            variant="outline"
            size="lg"
            className="mr-4"
          >
            Create Another Prompt
          </Button>
          <Button 
            onClick={() => navigate('/')}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

// About Page
const AboutPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">About BizBuddy</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your AI-powered companion for creating professional marketing assets
          </p>
        </div>

        <div className="space-y-8">
          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                BizBuddy bridges the gap between raw business ideas and professional marketing execution. 
                We believe every entrepreneur deserves access to high-quality marketing assets, regardless 
                of their budget or design skills.
              </p>
              <p className="text-gray-600 leading-relaxed">
                By transforming your business concepts into structured, professional prompts, we empower 
                you to leverage ChatGPT's capabilities to create marketing materials that rival those 
                produced by expensive agencies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our system uses specialized backend master prompts, each optimized for different marketing 
                outcomes. When you input your business details, we populate these templates with your specific 
                information, creating a comprehensive, structured prompt that guides ChatGPT to produce 
                professional-grade results.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Each prompt includes role definitions, clear objectives, detailed context, step-by-step 
                instructions, and quality guidelines to ensure consistent, high-quality outputs every time.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-0">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">BizBuddy Team</span>
                </div>
                <p className="text-gray-600">
                  Have questions or feedback? We'd love to hear from you!
                </p>
                <div className="flex space-x-4">
                  <Button variant="outline">
                    Send Email
                  </Button>
                  <Button 
                    onClick={() => navigate('/modes')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  >
                    Try BizBuddy Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/modes" element={<ModesPage />} />
          <Route path="/builder" element={<PromptBuilderPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;