import { getTestimonials } from '@/app/actions/cms';
import ReviewsEditor from './ReviewsEditor';

export default async function ReviewsAdmin() {
  const reviews = await getTestimonials();
  return <ReviewsEditor initialReviews={reviews} />;
}
