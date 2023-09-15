import {AiTwotoneStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcase} from 'react-icons/bs'

import './index.css'

const SimilarJobItem = props => {
  const {jobDetails} = props

  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    jobDescription,
  } = jobDetails

  return (
    <li className="similar-job-item">
      <div className="img-card">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="company-logo"
        />
        <div className="rating-title">
          <h1 className="title">{title}</h1>
          <div className="rating">
            <AiTwotoneStar className="star" />
            <p className="rating-text">{rating}</p>
          </div>
        </div>
      </div>
      <div>
        <h1 className="job-description-heading">Description</h1>
        <p>{jobDescription}</p>
      </div>
      <div className="similar-job-location-employment">
        <div className="location-card">
          <MdLocationOn />
          <p className="text">{location}</p>
        </div>

        <div className="location-card">
          <BsBriefcase />
          <p className="text">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobItem
