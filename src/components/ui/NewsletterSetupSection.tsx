import React, { useEffect, useState } from "react";
import Button from "./Button";
import { Eye, EyeOff, ExternalLink, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useOnboarding } from "@/components/OnboardingContext";
import { images } from "@/assets";
import Image from "next/image";
interface NewsletterSetupSectionProps {
  onSubmit: (data: { provider: string; apiKey?: string; clientId?: string; clientSecret?: string }) => void;
}

const NewsletterSetupSection: React.FC<NewsletterSetupSectionProps> = ({
  onSubmit,
}) => {
  const [provider, setProvider] = useState<"Mailchimp" | "HubSpot" | "">("");
  const [apiKey, setApiKey] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [availableServices, setAvailableServices] = useState<Record<string, string> | null>(null);
  const [servicesLoading, setServicesLoading] = useState(false);
  const { setState } = useOnboarding();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setServicesLoading(true);
        const res = await api.getNewsletterServices();
        if (mounted) setAvailableServices(res.newsletter_services || {});
      } catch {
        // ignore, UI will fallback
      } finally {
        if (mounted) setServicesLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // API verification function
  const verifyCredentials = async () => {
    setVerificationStatus("verifying");
    setVerificationMessage("");
    try {
      let requestBody: Record<string, string> = {};
      
      if (provider === "Mailchimp") {
        if (!apiKey.trim()) {
          throw new Error("API Key is required");
        }
        requestBody = { service: "mailchimp", api_key: apiKey };
      } else if (provider === "HubSpot") {
        if (!clientId.trim() || !clientSecret.trim()) {
          throw new Error("Both Client ID and Client Secret are required");
        }
        requestBody = { service: "hubspot", client_id: clientId, client_secret: clientSecret };
      }

      const data = await api.verifyNewsletterCredentials(requestBody);
      if (data.success) {
        setVerificationStatus("success");
        setVerificationMessage(data.message || "Credentials verified successfully!");
        // persist in onboarding state
        setState(prev => ({
          ...prev,
          newsletter: requestBody,
        }));
      } else {
        throw new Error(data.message || "Verification failed");
      }
    } catch (error) {
      setVerificationStatus("error");
      const errorMessage = error instanceof Error ? error.message : "Network error occurred";
      setVerificationMessage(errorMessage);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider) return;
    
    if (verificationStatus !== "success") {
      setVerificationMessage("Please verify your credentials before proceeding");
      return;
    }

    if (provider === "Mailchimp") {
      onSubmit({ provider, apiKey: apiKey || undefined });
    } else if (provider === "HubSpot") {
      onSubmit({ provider, clientId: clientId || undefined, clientSecret: clientSecret || undefined });
    }
  };

  return (
    <div className="w-full animate-fade-in-up">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="section-title text-[#333333] text-center animate-fade-in-down">
          Setup your Newsletter
        </h2>
        <p className="text-center mt-2 font-outfit text-[#333333] animate-fade-in">
          Choose your provider and connect your newsletter.
        </p>
      </div>

      {/* Step 1: Select Provider */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        {/* Mailchimp Card */}
        <div
          onClick={() => {
            if (availableServices && !availableServices.mailchimp) return;
            setProvider("Mailchimp");
            setVerificationStatus("idle");
            setVerificationMessage("");
          }}
          className={`cursor-pointer border rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
            provider === "Mailchimp"
              ? "border-custom-red shadow-2xl -translate-y-2 bg-pink-50 scale-105"
              : "border-gray-200 shadow-lg hover:border-custom-red hover:bg-pink-50 hover:scale-105"
          }`}
        >
          <Image alt="" src={images.mailchimpIcon} />
          <h3 className="font-outfit text-xl font-bold text-[#333333]">Mailchimp {servicesLoading ? '(...)' : ''}</h3>
          <p className="text-sm text-gray-600 text-center">
            Connect via API Key
          </p>
          {availableServices && !availableServices.mailchimp && (
            <p className="text-xs text-gray-500">Not available</p>
          )}
        </div>

        {/* HubSpot Card */}
        <div
          onClick={() => {
            if (availableServices && !availableServices.hubspot) return;
            setProvider("HubSpot");
            setVerificationStatus("idle");
            setVerificationMessage("");
          }}
          className={`cursor-pointer border rounded-3xl p-8 flex flex-col items-center justify-center space-y-4 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl ${
            provider === "HubSpot"
              ? "border-custom-red shadow-2xl -translate-y-2 bg-blue-50 scale-105"
              : "border-gray-200 shadow-lg hover:border-custom-red hover:bg-blue-50 hover:scale-105"
          }`}
        >
          <Image src={images.hubspotIcon} alt="" />
          <h3 className="font-outfit text-xl font-bold text-[#333333]">HubSpot {servicesLoading ? '(...)' : ''}</h3>
          <p className="text-sm text-gray-600 text-center">
            Connect via Client ID and Client Secret
          </p>
          {availableServices && !availableServices.hubspot && (
            <p className="text-xs text-gray-500">Not available</p>
          )}
        </div>
      </div>

      {!provider && (
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => onSubmit({ provider: "Skipped" })}
            className="custom-btn !px-6 !py-2 bg-custom-red hover:bg-custom-red transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
          >
            Skip
          </Button>
        </div>
      )}

      {/* Step 2: Form (visible only after provider selection) */}
      {provider && (
        <div className="space-y-5">
          {/* Documentation Link */}
          <div className="text-center mb-4">
            <a
              href={provider === "Mailchimp" 
                ? "https://mailchimp.com/developer/marketing/guides/quick-start/#generate-your-api-key"
                : "#" // You mentioned you'll provide HubSpot link later
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm underline transition-colors font-outfit"
            >
              <ExternalLink className="w-4 h-4" />
              {provider === "Mailchimp" 
                ? "How to find your Mailchimp API Key"
                : "How to find your HubSpot credentials"
              }
            </a>
          </div>

          {provider === "Mailchimp" && (
            <div className="firstVerifyScreen group">
              <div className="relative w-full">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                  style={{ color: "#949494" }}
                  placeholder="Mailchimp API Key"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          {provider === "HubSpot" && (
            <>
              <div className="firstVerifyScreen group">
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-4 py-3 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                  style={{ color: "#949494" }}
                  placeholder="HubSpot Client ID"
                  required
                />
              </div>
              <div className="firstVerifyScreen group">
                <div className="relative w-full">
                  <input
                    type={showClientSecret ? "text" : "password"}
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-red/20 transition-all duration-300 firstVerifyScreenInput transform hover:scale-[1.02] hover:shadow-lg focus:scale-[1.02] focus:shadow-xl"
                    style={{ color: "#949494" }}
                    placeholder="HubSpot Client Secret"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowClientSecret(!showClientSecret)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showClientSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Verify Button */}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={verifyCredentials}
              disabled={verificationStatus === "verifying"}
              className="custom-btn !px-6 !py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              {verificationStatus === "verifying" && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {verificationStatus === "verifying" ? "Verifying..." : "Verify Credentials"}
            </Button>
          </div>

          {/* Verification Status */}
          {verificationMessage && (
            <div className={`flex items-center gap-2 p-3 rounded-lg font-outfit ${
              verificationStatus === "success" 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {verificationStatus === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <XCircle className="w-5 h-5" />
              )}
              <span className="text-sm font-medium">{verificationMessage}</span>
            </div>
          )}
          
          <div className="flex justify-between pt-2">
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={verificationStatus !== "success"}
              className="custom-btn !px-6 !py-2 bg-custom-red hover:bg-custom-red disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              {verificationStatus === "success" ? 'Save & Continue' : 'Verify to Continue'}
            </Button>
            <Button
              type="button"
              onClick={() => onSubmit({ provider: "Skipped" })}
              className="custom-btn !px-6 !py-2 bg-custom-red hover:bg-custom-red transform hover:scale-105 hover:-translate-y-1 active:scale-95 transition-all duration-300"
            >
              Skip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsletterSetupSection;