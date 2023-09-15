import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiTwotoneStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcase} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Header from '../Header'
import SimilarJobItem from '../SimilarJobItem'
import './index.css'

const apisStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetails: [],
    similarJobsList: [],
    pageStatus: apisStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({pageStatus: apisStatusConstants.in_progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },

      method: 'GET',
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updateData = [data.job_details].map(obj => ({
        companyLogoUrl: obj.company_logo_url,
        employmentType: obj.employment_type,
        id: obj.id,
        companyWebsiteUrl: obj.company_website_url,
        lifeAtCompany: {
          description: obj.life_at_company.description,
          imageUrl: obj.life_at_company.image_url,
        },
        skills: obj.skills.map(eachItem => ({
          name: eachItem.name,
          imageUrl: eachItem.image_url,
        })),
        jobDescription: obj.job_description,
        location: obj.location,
        packagePerAnnum: obj.package_per_annum,
        title: obj.title,
        rating: obj.rating,
      }))

      const updateSimilarJobs = data.similar_jobs.map(obj => ({
        companyLogoUrl: obj.company_logo_url,
        employmentType: obj.employment_type,
        id: obj.id,
        jobDescription: obj.job_description,
        location: obj.location,
        title: obj.title,
        rating: obj.rating,
      }))

      this.setState({
        jobItemDetails: updateData,
        similarJobsList: updateSimilarJobs,
        pageStatus: apisStatusConstants.success,
      })
    } else {
      this.setState({pageStatus: apisStatusConstants.failure})
    }
  }

  getJobApi = () => {
    this.getJobDetails()
  }

  jobDetailsSuccessView = () => {
    const {jobItemDetails, similarJobsList} = this.state

    if (jobItemDetails.length >= 1) {
      const {
        companyLogoUrl,
        companyWebsiteUrl,
        employmentType,
        // pradeep
        title,
        rating,
        location,
        packagePerAnnum,
        jobDescription,
        lifeAtCompany,
        skills,
      } = jobItemDetails[0]

      return (
        <div>
          <div className="job-details-card">
            <div className="img-card">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
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
            <div className="description-visit">
              <h1 className="job-description-heading">Description</h1>
              <div className="visit-link">
                <a href={companyWebsiteUrl} className="visit-text">
                  Visit
                </a>
                <BiLinkExternal className="icon" />
              </div>
            </div>
            <p className="job-description">{jobDescription}</p>
            <div className="heading-skills">
              <h1 className="skill-heading">Skills</h1>
              <ul className="skills-list">
                {skills.map(each => (
                  <li key={each.name} className="skill-card">
                    <img
                      src={each.imageUrl}
                      alt={each.name}
                      className="skill-img"
                    />
                    <p className="skill-name">{each.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <h1 className="skill-heading">Life at Company</h1>
            <div className="life-at-company-container">
              <p className="life-a-company-description">
                {lifeAtCompany.description}
              </p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-a-company-img"
              />
            </div>
          </div>
          <h1 className="similar-job-heading">Similar Jobs</h1>
          <ul className="similar-job-list">
            {similarJobsList.map(eachJob => (
              <SimilarJobItem jobDetails={eachJob} key={eachJob.id} />
            ))}
          </ul>
        </div>
      )
    }
    return null
  }

  jobDetailsLoadingView = () => (
    <div data-testid="loader" className="pradeep-loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  jobDetailsFailureView = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <div className="failure-text-card">
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-para">
          we cannot seem to find the page you are looking for.
        </p>
        <button className="retry-btn" type="button" onClick={this.getJobApi}>
          Retry
        </button>
      </div>
    </div>
  )

  getJobDetailsView = () => {
    const {pageStatus} = this.state

    switch (pageStatus) {
      case apisStatusConstants.in_progress:
        return this.jobDetailsLoadingView()
      case apisStatusConstants.success:
        return this.jobDetailsSuccessView()
      case apisStatusConstants.failure:
        return this.jobDetailsFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main">
        <Header />
        <div className="job-details-container">{this.getJobDetailsView()}</div>
      </div>
    )
  }
}

export default JobItemDetails
