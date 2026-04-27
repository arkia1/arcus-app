import { Injectable } from '@nestjs/common';
import type { AuthenticatedUser } from '../auth/auth.types';

@Injectable()
export class CoursesService {
  getCoursesForUser(user: AuthenticatedUser) {
    return {
      learner: user,
      courses: [
        {
          id: 'course-product-strategy',
          title: 'Product Strategy Foundations',
          progress: 42,
          level: 'Intermediate',
        },
        {
          id: 'course-growth-analytics',
          title: 'Growth Analytics Essentials',
          progress: 18,
          level: 'Beginner',
        },
        {
          id: 'course-ai-workflows',
          title: 'AI Workflow Design',
          progress: 73,
          level: 'Advanced',
        },
      ],
    };
  }
}
