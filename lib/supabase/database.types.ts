/**
 * Tipos generados a partir de supabase/schema.sql.
 * Regenerar con `supabase gen types typescript` una vez conectado el proyecto real.
 */
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          org_id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          name: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
        Relationships: [];
      };
      project_members: {
        Row: {
          project_id: string;
          user_id: string;
          role: "owner" | "editor" | "viewer";
        };
        Insert: {
          project_id: string;
          user_id: string;
          role?: "owner" | "editor" | "viewer";
        };
        Update: Partial<
          Database["public"]["Tables"]["project_members"]["Insert"]
        >;
        Relationships: [];
      };
      bim_models: {
        Row: {
          id: string;
          project_id: string;
          storage_path: string;
          original_filename: string;
          status: "uploaded" | "parsing" | "ready" | "error";
          version: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          storage_path: string;
          original_filename: string;
          status?: "uploaded" | "parsing" | "ready" | "error";
          version?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bim_models"]["Insert"]>;
        Relationships: [];
      };
      bim_elements: {
        Row: {
          id: string;
          model_id: string;
          ifc_global_id: string;
          ifc_type: string;
          name: string | null;
          express_id: number;
          properties: Record<string, unknown>;
        };
        Insert: {
          id?: string;
          model_id: string;
          ifc_global_id: string;
          ifc_type: string;
          name?: string | null;
          express_id: number;
          properties?: Record<string, unknown>;
        };
        Update: Partial<
          Database["public"]["Tables"]["bim_elements"]["Insert"]
        >;
        Relationships: [];
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          parent_id: string | null;
          name: string;
          start_date: string;
          end_date: string;
          progress: number;
          status: "pending" | "in_progress" | "done" | "blocked";
          dependencies: string[];
        };
        Insert: {
          id?: string;
          project_id: string;
          parent_id?: string | null;
          name: string;
          start_date: string;
          end_date: string;
          progress?: number;
          status?: "pending" | "in_progress" | "done" | "blocked";
          dependencies?: string[];
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [];
      };
      element_task_links: {
        Row: {
          id: string;
          element_id: string;
          task_id: string;
          weight: number;
        };
        Insert: {
          id?: string;
          element_id: string;
          task_id: string;
          weight?: number;
        };
        Update: Partial<
          Database["public"]["Tables"]["element_task_links"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: {
      bim_element_progress: {
        Row: {
          element_id: string;
          model_id: string;
          progress: number;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: {
      bim_model_status: "uploaded" | "parsing" | "ready" | "error";
      task_status: "pending" | "in_progress" | "done" | "blocked";
      project_role: "owner" | "editor" | "viewer";
    };
    CompositeTypes: Record<string, never>;
  };
};
