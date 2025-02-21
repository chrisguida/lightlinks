import { Switch, Route, useRoute } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import AdPage from "@/pages/ad";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { Relay } from "nostr-tools";

declare global {
  interface Window {
    relay: any;
  }
}


function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/ad/:id" component={AdPage}/>
      <Route path="/affiliate/:npub" component={AffiliatePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AffiliatePage() {
  const [match, params] = useRoute("/affiliate/:npub");
  const npub = match ? params.npub : null;
  const [events, setEvents] = useState<any[]>([]);

  console.log("Router query (npub):", npub);

  useEffect(() => {
    console.log("useEffect triggered with npub:", npub);
    if (!npub) return;

    const fetchAffiliateLinks = async () => {
      try {
        console.log("Connecting to relay...");
        const relay = await Relay.connect("wss://relay.damus.io");
        window.relay = relay;
        console.log("Connected to relay:", relay.url);

        relay.subscribe(
          // [{ kinds: [13166], authors: [npub] }],
          [{ kinds: [13166] }],
          {
            onevent(event) {
              console.log("Received event:", event);
              setEvents((prev) => [...prev, event]);
            },
          }
        );
      } catch (error) {
        console.error("Error connecting to relay:", error);
      }
    };

    fetchAffiliateLinks();
  }, [npub]);

  return (
    <div>
      <h1>Affiliate Links</h1>
      <h2>Classifieds</h2>
      <pre>{JSON.stringify(events, null, 2)}</pre>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
