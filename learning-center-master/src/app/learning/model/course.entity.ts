/**
 * Represents a course entity in the system
 */
export class Course {
  /** Unique identifier for the course */
  id: number;

  /** Title of the course */
  title: string;

  /** Detailed description of the course content */
  description: string;

  /**
   * Creates a new Course instance
   * @param course - The course initialization object
   * @param course.id - The course ID (defaults to 0 if not provided)
   * @param course.title - The course title (defaults to empty string if not provided)
   * @param course.description - The course description (defaults to empty string if not provided)
   */
  constructor(course: {id?: number, title?: string, description?: string}) {
    this.id = course.id || 0;
    this.title = course.title || '';
    this.description = course.description || '';
  }
}
