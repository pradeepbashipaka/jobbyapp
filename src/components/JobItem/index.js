import {Link} from 'react-router-dom'

import {AiTwotoneStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcase} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
    id,
  } = jobDetails

  return (
    <li className="job-card">
      <Link to={`/jobs/${id}`} className="item">
        <div className="img-card">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
        <div className="location-employment-salary">
          <div className="location-employment">
            <div className="location-card">
              <MdLocationOn />
              <p className="text">{location}</p>
            </div>

            <div className="location-card">
              <BsBriefcase />
              <p className="text">{employmentType}</p>
            </div>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr />
        <div>
          <h1 className="job-description-heading">Description</h1>
          <p>{jobDescription}</p>
        </div>
      </Link>
    </li>
  )
}

export default JobItem
