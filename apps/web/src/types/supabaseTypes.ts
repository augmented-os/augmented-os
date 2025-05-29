export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      integration_definitions: {
        Row: {
          ai_config: Json | null
          auth_type: Database["public"]["Enums"]["auth_method_enum"]
          config_schema: Json | null
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          integration_id: string
          methods: Json | null
          name: string
          oauth2_config: Json | null
          type: Database["public"]["Enums"]["integration_type_enum"]
          updated_at: string
          version: string
        }
        Insert: {
          ai_config?: Json | null
          auth_type: Database["public"]["Enums"]["auth_method_enum"]
          config_schema?: Json | null
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          integration_id: string
          methods?: Json | null
          name: string
          oauth2_config?: Json | null
          type?: Database["public"]["Enums"]["integration_type_enum"]
          updated_at?: string
          version: string
        }
        Update: {
          ai_config?: Json | null
          auth_type?: Database["public"]["Enums"]["auth_method_enum"]
          config_schema?: Json | null
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          integration_id?: string
          methods?: Json | null
          name?: string
          oauth2_config?: Json | null
          type?: Database["public"]["Enums"]["integration_type_enum"]
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      integration_instances: {
        Row: {
          config: Json | null
          context_id: string | null
          context_type: Database["public"]["Enums"]["context_scope_enum"]
          created_at: string
          credentials: string | null
          description: string | null
          id: string
          instance_id: string
          integration_definition_id: string
          last_used_at: string | null
          name: string
          status: Json | null
          updated_at: string
        }
        Insert: {
          config?: Json | null
          context_id?: string | null
          context_type?: Database["public"]["Enums"]["context_scope_enum"]
          created_at?: string
          credentials?: string | null
          description?: string | null
          id?: string
          instance_id: string
          integration_definition_id: string
          last_used_at?: string | null
          name: string
          status?: Json | null
          updated_at?: string
        }
        Update: {
          config?: Json | null
          context_id?: string | null
          context_type?: Database["public"]["Enums"]["context_scope_enum"]
          created_at?: string
          credentials?: string | null
          description?: string | null
          id?: string
          instance_id?: string
          integration_definition_id?: string
          last_used_at?: string | null
          name?: string
          status?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_instances_integration_definition_id_fkey"
            columns: ["integration_definition_id"]
            isOneToOne: false
            referencedRelation: "integration_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_document_versions: {
        Row: {
          author: string | null
          created_at: string | null
          diff: Json | null
          doc_id: string | null
          id: string
          yjs_state: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          diff?: Json | null
          doc_id?: string | null
          id?: string
          yjs_state?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          diff?: Json | null
          doc_id?: string | null
          id?: string
          yjs_state?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "poc_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_documents: {
        Row: {
          created_at: string | null
          id: string
          path: string | null
          slug: string | null
          tags: string[] | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          path?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          path?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string | null
        }
        Relationships: []
      }
      poc_draft_diffs: {
        Row: {
          created_at: string | null
          diff: Json | null
          doc_id: string | null
          id: string
          status: string | null
        }
        Insert: {
          created_at?: string | null
          diff?: Json | null
          doc_id?: string | null
          id?: string
          status?: string | null
        }
        Update: {
          created_at?: string | null
          diff?: Json | null
          doc_id?: string | null
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "draft_diffs_doc_id_fkey"
            columns: ["doc_id"]
            isOneToOne: false
            referencedRelation: "poc_documents"
            referencedColumns: ["id"]
          },
        ]
      }
      poc_integrations: {
        Row: {
          category: string
          config_schema: Json | null
          created_at: string | null
          icon_url: string | null
          id: string
          input_schema: Json | null
          name: string
          output_schema: Json | null
          provider: string
          requires_connection: boolean
          updated_at: string | null
        }
        Insert: {
          category: string
          config_schema?: Json | null
          created_at?: string | null
          icon_url?: string | null
          id?: string
          input_schema?: Json | null
          name: string
          output_schema?: Json | null
          provider: string
          requires_connection?: boolean
          updated_at?: string | null
        }
        Update: {
          category?: string
          config_schema?: Json | null
          created_at?: string | null
          icon_url?: string | null
          id?: string
          input_schema?: Json | null
          name?: string
          output_schema?: Json | null
          provider?: string
          requires_connection?: boolean
          updated_at?: string | null
        }
        Relationships: []
      }
      poc_workflow_folders: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      poc_workflows: {
        Row: {
          created_at: string | null
          description: string | null
          edges: Json
          id: string
          input_schema: Json | null
          name: string
          nodes: Json
          output_schema: Json | null
          updated_at: string | null
          workflow_folder_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          edges: Json
          id?: string
          input_schema?: Json | null
          name: string
          nodes: Json
          output_schema?: Json | null
          updated_at?: string | null
          workflow_folder_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          edges?: Json
          id?: string
          input_schema?: Json | null
          name?: string
          nodes?: Json
          output_schema?: Json | null
          updated_at?: string | null
          workflow_folder_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_workflow_folder"
            columns: ["workflow_folder_id"]
            isOneToOne: false
            referencedRelation: "poc_workflow_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      schema_migrations: {
        Row: {
          applied_by: string | null
          created_at: string
          details: string | null
          migration_id: string
          status: string
          tenant_id: string
          tenant_schema_id: string
          updated_at: string
          version_applied: number
        }
        Insert: {
          applied_by?: string | null
          created_at?: string
          details?: string | null
          migration_id?: string
          status?: string
          tenant_id: string
          tenant_schema_id: string
          updated_at?: string
          version_applied: number
        }
        Update: {
          applied_by?: string | null
          created_at?: string
          details?: string | null
          migration_id?: string
          status?: string
          tenant_id?: string
          tenant_schema_id?: string
          updated_at?: string
          version_applied?: number
        }
        Relationships: [
          {
            foreignKeyName: "schema_migrations_tenant_schema_id_fkey"
            columns: ["tenant_schema_id"]
            isOneToOne: false
            referencedRelation: "tenant_schemas"
            referencedColumns: ["schema_id"]
          },
        ]
      }
      task_definitions: {
        Row: {
          created_at: string
          description: string | null
          execution_config: Json
          id: string
          input_schema: Json
          metadata: Json | null
          name: string
          output_schema: Json
          retry_policy: Json | null
          task_id: string
          timeout: number | null
          type: Database["public"]["Enums"]["task_type"]
          ui_components: Json | null
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          execution_config: Json
          id?: string
          input_schema: Json
          metadata?: Json | null
          name: string
          output_schema: Json
          retry_policy?: Json | null
          task_id: string
          timeout?: number | null
          type: Database["public"]["Enums"]["task_type"]
          ui_components?: Json | null
          updated_at?: string
          version: string
        }
        Update: {
          created_at?: string
          description?: string | null
          execution_config?: Json
          id?: string
          input_schema?: Json
          metadata?: Json | null
          name?: string
          output_schema?: Json
          retry_policy?: Json | null
          task_id?: string
          timeout?: number | null
          type?: Database["public"]["Enums"]["task_type"]
          ui_components?: Json | null
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      task_instances: {
        Row: {
          assignee: string | null
          created_at: string
          error: Json | null
          execution_metadata: Json
          executor_id: string
          id: string
          input: Json
          output: Json | null
          priority: Database["public"]["Enums"]["task_priority"]
          retry_count: number
          retry_policy: Json | null
          status: Database["public"]["Enums"]["task_status"]
          step_id: string
          task_definition_id: string
          task_reference: string | null
          type: Database["public"]["Enums"]["task_type"]
          updated_at: string
          version: number
          workflow_definition_id: string | null
          workflow_instance_id: string | null
        }
        Insert: {
          assignee?: string | null
          created_at?: string
          error?: Json | null
          execution_metadata: Json
          executor_id: string
          id?: string
          input: Json
          output?: Json | null
          priority?: Database["public"]["Enums"]["task_priority"]
          retry_count?: number
          retry_policy?: Json | null
          status: Database["public"]["Enums"]["task_status"]
          step_id: string
          task_definition_id: string
          task_reference?: string | null
          type: Database["public"]["Enums"]["task_type"]
          updated_at?: string
          version?: number
          workflow_definition_id?: string | null
          workflow_instance_id?: string | null
        }
        Update: {
          assignee?: string | null
          created_at?: string
          error?: Json | null
          execution_metadata?: Json
          executor_id?: string
          id?: string
          input?: Json
          output?: Json | null
          priority?: Database["public"]["Enums"]["task_priority"]
          retry_count?: number
          retry_policy?: Json | null
          status?: Database["public"]["Enums"]["task_status"]
          step_id?: string
          task_definition_id?: string
          task_reference?: string | null
          type?: Database["public"]["Enums"]["task_type"]
          updated_at?: string
          version?: number
          workflow_definition_id?: string | null
          workflow_instance_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_instances_task_definition_id_fkey"
            columns: ["task_definition_id"]
            isOneToOne: false
            referencedRelation: "task_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_instances_workflow_definition_id_fkey"
            columns: ["workflow_definition_id"]
            isOneToOne: false
            referencedRelation: "workflow_definitions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_instances_workflow_instance_id_fkey"
            columns: ["workflow_instance_id"]
            isOneToOne: false
            referencedRelation: "workflow_instances"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_schemas: {
        Row: {
          applied_at: string | null
          created_at: string
          schema_id: string
          schema_json: Json
          tenant_id: string
          updated_at: string
          version: number
        }
        Insert: {
          applied_at?: string | null
          created_at?: string
          schema_id?: string
          schema_json: Json
          tenant_id: string
          updated_at?: string
          version: number
        }
        Update: {
          applied_at?: string | null
          created_at?: string
          schema_id?: string
          schema_json?: Json
          tenant_id?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      ui_components: {
        Row: {
          actions: Json | null
          component_id: string
          component_type: string
          created_at: string | null
          custom_props: Json | null
          description: string | null
          display_template: string | null
          fields: Json | null
          id: string
          layout: Json | null
          name: string
          title: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          actions?: Json | null
          component_id: string
          component_type: string
          created_at?: string | null
          custom_props?: Json | null
          description?: string | null
          display_template?: string | null
          fields?: Json | null
          id?: string
          layout?: Json | null
          name: string
          title: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          actions?: Json | null
          component_id?: string
          component_type?: string
          created_at?: string | null
          custom_props?: Json | null
          description?: string | null
          display_template?: string | null
          fields?: Json | null
          id?: string
          layout?: Json | null
          name?: string
          title?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      validation_rules: {
        Row: {
          created_at: string | null
          description: string
          error_message: string
          id: string
          rule_id: string
          type: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          error_message: string
          id?: string
          rule_id: string
          type: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          error_message?: string
          id?: string
          rule_id?: string
          type?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      workflow_definitions: {
        Row: {
          created_at: string
          description: string | null
          execution_log: Json | null
          id: string
          input_schema: Json | null
          name: string
          steps: Json | null
          ui_components: Json | null
          updated_at: string
          version: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          execution_log?: Json | null
          id?: string
          input_schema?: Json | null
          name: string
          steps?: Json | null
          ui_components?: Json | null
          updated_at?: string
          version: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          execution_log?: Json | null
          id?: string
          input_schema?: Json | null
          name?: string
          steps?: Json | null
          ui_components?: Json | null
          updated_at?: string
          version?: string
          workflow_id?: string
        }
        Relationships: []
      }
      workflow_instances: {
        Row: {
          completed_at: string | null
          correlation_id: string | null
          current_step_id: string | null
          error: Json | null
          id: string
          input: Json | null
          started_at: string
          state: Json
          status: string
          trigger_event_id: string | null
          updated_at: string
          workflow_definition_id: string | null
        }
        Insert: {
          completed_at?: string | null
          correlation_id?: string | null
          current_step_id?: string | null
          error?: Json | null
          id?: string
          input?: Json | null
          started_at?: string
          state?: Json
          status: string
          trigger_event_id?: string | null
          updated_at?: string
          workflow_definition_id?: string | null
        }
        Update: {
          completed_at?: string | null
          correlation_id?: string | null
          current_step_id?: string | null
          error?: Json | null
          id?: string
          input?: Json | null
          started_at?: string
          state?: Json
          status?: string
          trigger_event_id?: string | null
          updated_at?: string
          workflow_definition_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_instances_workflow_definition_id_fkey"
            columns: ["workflow_definition_id"]
            isOneToOne: false
            referencedRelation: "workflow_definitions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      _ltree_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      _ltree_gist_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      lca: {
        Args: { "": unknown[] }
        Returns: unknown
      }
      lquery_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      lquery_send: {
        Args: { "": unknown }
        Returns: string
      }
      ltree_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_gist_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_gist_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      ltree_gist_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltree_send: {
        Args: { "": unknown }
        Returns: string
      }
      ltree2text: {
        Args: { "": unknown }
        Returns: string
      }
      ltxtq_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_recv: {
        Args: { "": unknown }
        Returns: unknown
      }
      ltxtq_send: {
        Args: { "": unknown }
        Returns: string
      }
      nlevel: {
        Args: { "": unknown }
        Returns: number
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      text2ltree: {
        Args: { "": string }
        Returns: unknown
      }
    }
    Enums: {
      auth_method_enum: "oauth2" | "apikey" | "custom"
      context_scope_enum: "global" | "client" | "user"
      integration_type_enum: "integration" | "ai" | "documents" | "database"
      task_priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      task_status:
        | "PENDING"
        | "ASSIGNED"
        | "RUNNING"
        | "COMPLETED"
        | "FAILED"
        | "CANCELLED"
        | "TIMED_OUT"
      task_type: "AUTOMATED" | "MANUAL" | "INTEGRATION"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      auth_method_enum: ["oauth2", "apikey", "custom"],
      context_scope_enum: ["global", "client", "user"],
      integration_type_enum: ["integration", "ai", "documents", "database"],
      task_priority: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      task_status: [
        "PENDING",
        "ASSIGNED",
        "RUNNING",
        "COMPLETED",
        "FAILED",
        "CANCELLED",
        "TIMED_OUT",
      ],
      task_type: ["AUTOMATED", "MANUAL", "INTEGRATION"],
    },
  },
} as const

