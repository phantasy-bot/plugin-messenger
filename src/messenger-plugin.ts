import {
  BasePlugin,
  type PlatformCapability,
  type PluginConfig,
  type PluginTool,
} from "@phantasy/agent/plugins";
import { createPluginModuleLogger } from "@phantasy/agent/plugin-runtime";

const log = createPluginModuleLogger("MessengerPlugin");

const STUB_MESSAGE =
  "Facebook Messenger integration is scaffolded but not enabled yet. Configure Meta page credentials and wait for the Chat SDK bridge rollout.";

function jsonResponse(body: unknown, status: number = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export class MessengerPlugin extends BasePlugin implements PlatformCapability {
  name = "messenger";
  version = "0.1.0";
  description = "Facebook Messenger integration for Phantasy companions (coming soon).";

  protected displayName = "Messenger";
  protected category = "messaging";
  protected tags = ["messenger", "facebook", "meta", "messaging"];
  protected permissions = ["internet"];
  protected workspace = "business" as const;
  protected extensionKind = "integration" as const;
  protected isPlatform = true;
  protected platformFeatures = {
    messaging: true,
    autonomous: false,
  } as const;
  protected adminSurface = {
    tabId: "messenger",
    label: "Messenger",
    section: "business",
    workspace: "business",
    kind: "generic",
    keywords: ["messenger", "facebook", "meta", "messaging"],
    dashboardIcon: "messenger",
  } as const;
  protected configSchema = {
    type: "object",
    properties: {
      enabled: { type: "boolean", default: false, title: "Enabled" },
      pageAccessToken: {
        type: "string",
        title: "Page access token",
        format: "password",
      },
      appSecret: { type: "string", title: "App secret", format: "password" },
      verifyToken: { type: "string", title: "Webhook verify token" },
    },
  };

  getTools(): PluginTool[] {
    return [];
  }

  async startBot(): Promise<{ success: boolean; message?: string }> {
    return { success: false, message: STUB_MESSAGE };
  }

  async stopBot(): Promise<{ success: boolean; message?: string }> {
    return { success: true, message: "Messenger integration is not running" };
  }

  async getBotStatus(): Promise<{
    connected: boolean;
    streaming?: boolean;
    autonomousPosting?: boolean;
    error?: string;
    summary?: string;
    recommendedActions?: string[];
  }> {
    return {
      connected: false,
      streaming: false,
      autonomousPosting: false,
      error: STUB_MESSAGE,
      summary: "Coming soon",
      recommendedActions: [
        "Add FACEBOOK_PAGE_ACCESS_TOKEN, FACEBOOK_APP_SECRET, and FACEBOOK_VERIFY_TOKEN when the bridge ships.",
        "Webhook target will be /admin/api/plugins/messenger/webhook.",
      ],
    };
  }

  async sendMessage(): Promise<{ success: boolean; error?: string }> {
    return { success: false, error: STUB_MESSAGE };
  }

  async handleCustomEndpoint(request: Request, path: string): Promise<Response | null> {
    try {
      if ((path === "/status" || path === "/bot-status") && request.method === "GET") {
        const status = await this.getBotStatus();
        return jsonResponse({
          enabled: this.isEnabled(),
          connected: status.connected,
          comingSoon: true,
          error: status.error,
          summary: status.summary,
          recommendedActions: status.recommendedActions,
        });
      }

      if (
        (path === "/test" || path === "/test-connection") &&
        request.method === "POST"
      ) {
        return jsonResponse(
          {
            success: false,
            comingSoon: true,
            error: STUB_MESSAGE,
          },
          501,
        );
      }

      return null;
    } catch (error) {
      log.error("Messenger plugin endpoint failed", {
        path,
        error: error instanceof Error ? error.message : String(error),
      });
      return jsonResponse(
        { success: false, error: "Messenger plugin request failed" },
        500,
      );
    }
  }

  async onConfigUpdated(newConfig: PluginConfig): Promise<void> {
    await super.onConfigUpdated(newConfig);
  }
}

export default MessengerPlugin;
