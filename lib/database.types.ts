export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      feature_requests: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          status: string
          title: string
          total_bounty: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          status?: string
          title: string
          total_bounty?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          status?: string
          title?: string
          total_bounty?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_votes: {
        Row: {
          request_id: number
          user_id: string
          vote_type: number
        }
        Insert: {
          request_id: number
          user_id: string
          vote_type: number
        }
        Update: {
          request_id?: number
          user_id?: string
          vote_type?: number
        }
        Relationships: [
          {
            foreignKeyName: "feature_votes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_session_id: string | null
          avatar_url: string | null
          created_at: string | null
          dashboard_layout: Json | null
          first_name: string | null
          id: string
          last_name: string | null
          referral_code: string | null
          referred_by: string | null
          role: string
          username: string
          zero_coins: number
        }
        Insert: {
          active_session_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          dashboard_layout?: Json | null
          first_name?: string | null
          id: string
          last_name?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          username: string
          zero_coins?: number
        }
        Update: {
          active_session_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          dashboard_layout?: Json | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          username?: string
          zero_coins?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          role: string
          rpm_limit: number
        }
        Insert: {
          created_at?: string | null
          role: string
          rpm_limit?: number
        }
        Update: {
          created_at?: string | null
          role?: string
          rpm_limit?: number
        }
        Relationships: []
      }
      services: {
        Row: {
          api_cost: number | null
          api_url: string | null
          cost_per_query: number
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean
          is_api_active: boolean
          is_beta: boolean
          name: string
          thumbnail_url: string | null
        }
        Insert: {
          api_cost?: number | null
          api_url?: string | null
          cost_per_query?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_api_active?: boolean
          is_beta?: boolean
          name: string
          thumbnail_url?: string | null
        }
        Update: {
          api_cost?: number | null
          api_url?: string | null
          cost_per_query?: number
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_api_active?: boolean
          is_beta?: boolean
          name?: string
          thumbnail_url?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string | null
          id: number
          status: string
          subject: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          status?: string
          subject: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          status?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_invites: {
        Row: {
          created_at: string | null
          id: string
          invited_user_id: string
          inviter_user_id: string
          status: string
          team_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          invited_user_id: string
          inviter_user_id: string
          status?: string
          team_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          invited_user_id?: string
          inviter_user_id?: string
          status?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_invites_invited_user_id_fkey"
            columns: ["invited_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invites_inviter_user_id_fkey"
            columns: ["inviter_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invites_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          joined_at: string | null
          role: string
          spending_limit: number | null
          team_id: string
          user_id: string
        }
        Insert: {
          joined_at?: string | null
          role?: string
          spending_limit?: number | null
          team_id: string
          user_id: string
        }
        Update: {
          joined_at?: string | null
          role?: string
          spending_limit?: number | null
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner_id: string | null
          zero_coin_balance: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          owner_id?: string | null
          zero_coin_balance?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string | null
          zero_coin_balance?: number
        }
        Relationships: [
          {
            foreignKeyName: "teams_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_replies: {
        Row: {
          created_at: string | null
          id: number
          message: string
          ticket_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          message: string
          ticket_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          message?: string
          ticket_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_replies_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_replies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_log: {
        Row: {
          amount: number | null
          created_at: string | null
          description: string | null
          id: number
          team_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          team_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          description?: string | null
          id?: number
          team_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_log_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transaction_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_team_invite: {
        Args: { invite_id: string; p_user_id: string }
        Returns: undefined
      }
      award_referral_bonus: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      get_feature_requests_with_votes: {
        Args: { p_user_id: string }
        Returns: {
          id: number
          title: string
          description: string
          status: string
          total_bounty: number
          created_at: string
          username: string
          vote_total: number
          user_vote: number
        }[]
      }
      pledge_bounty_to_feature: {
        Args: { p_request_id: number; p_user_id: string; p_amount: number }
        Returns: undefined
      }
    }
    Enums: {
      service_status: "operational" | "maintenance" | "degraded" | "offline"
      team_role: "admin" | "manager" | "member"
      ticket_status: "open" | "pending" | "closed"
      user_role: "admin" | "dev" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      service_status: ["operational", "maintenance", "degraded", "offline"],
      team_role: ["admin", "manager", "member"],
      ticket_status: ["open", "pending", "closed"],
      user_role: ["admin", "dev", "user"],
    },
  },
} as const
