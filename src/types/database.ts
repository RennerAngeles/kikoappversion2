export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          location: string | null
          contact: string | null
          gender: string | null
          age: number | null
          profile_photo: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          location?: string | null
          contact?: string | null
          gender?: string | null
          age?: number | null
          profile_photo?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          location?: string | null
          contact?: string | null
          gender?: string | null
          age?: number | null
          profile_photo?: string | null
          created_at?: string
        }
      }
      shops: {
        Row: {
          id: string
          owner_id: string
          name: string
          location: string
          contact: string
          is_verified: boolean
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          location: string
          contact: string
          is_verified?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          location?: string
          contact?: string
          is_verified?: boolean
          created_at?: string
        }
      }
      verification_requests: {
        Row: {
          id: string
          user_id: string
          shop_id: string
          id_photo: string
          face_photo: string
          status: string
          restricted: boolean
          restriction_reason: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          shop_id: string
          id_photo: string
          face_photo: string
          status?: string
          restricted?: boolean
          restriction_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          shop_id?: string
          id_photo?: string
          face_photo?: string
          status?: string
          restricted?: boolean
          restriction_reason?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          seller_id: string
          name: string
          category: string
          price: number
          description: string
          image: string
          created_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          name: string
          category: string
          price: number
          description: string
          image: string
          created_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          name?: string
          category?: string
          price?: number
          description?: string
          image?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          product_id: string
          buyer_id: string
          seller_id: string
          quantity: number
          total_amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          buyer_id: string
          seller_id: string
          quantity: number
          total_amount: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          buyer_id?: string
          seller_id?: string
          quantity?: number
          total_amount?: number
          status?: string
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          order_id: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          order_id?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          order_id?: string | null
          read?: boolean
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          product_id: string
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          created_at?: string
        }
      }
      conversation_participants: {
        Row: {
          conversation_id: string
          user_id: string
        }
        Insert: {
          conversation_id: string
          user_id: string
        }
        Update: {
          conversation_id?: string
          user_id?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          receiver_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          receiver_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          receiver_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}