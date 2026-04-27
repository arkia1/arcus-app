import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {
  constructor(private readonly supabaseService: SupabaseService) {}

  getStatus() {
    return {
      message: 'Arcus backend is running',
      supabase: this.supabaseService.getStatus(),
    };
  }

  getSupabaseStatus() {
    return this.supabaseService.getStatus();
  }
}
