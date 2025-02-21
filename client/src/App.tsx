import { Switch, Route, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "@/pages/home";
import AdPage from "@/pages/ad";
import NotFound from "@/pages/not-found";


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
  console.log("router: Router query (npub):", npub);
  
  return (
    <div>
      <h1>Affiliate Links</h1>
      <h2>Classifieds</h2>
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
