import RatingValue from './RatingValue';
import Stars from './Stars';
import NumRatings from './NumRatings';

export default ({ rating, numRatings }) => {
  return (
    <div class="d-flex">
      <RatingValue rating={rating} />
      <Stars rating={rating} />
      <NumRatings numRatings={numRatings} />
    </div>
  )
}