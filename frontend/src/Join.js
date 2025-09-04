import './style/join.css';
import bgVideo from './vendors/coding-vid.mp4'
import { FORM_URL } from './config';

export default function Join() {
  return (
    <section className="join-section">
      <video src={bgVideo} autoPlay loop muted disablePictureInPicture></video>
      <h2>Join Us</h2>
      <p>Become a part of our community!</p>
      <p className="join-description">Here at <strong>Our Platform</strong>, we value collaboration and innovation.<br />Even if you don't have any experiance with coding, we can help you out!<br />Something, something, something</p>
      <a target="_blank" rel="noopener noreferrer" href={FORM_URL} className='join-button'>Join</a>
    </section>
  );
}