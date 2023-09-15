import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Header from '../Header'
import JobItem from '../JobItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apisStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN PROGRESS',
}

class JobRoute extends Component {
  state = {
    profile: {},
    pageStatus: apisStatusConstants.initial,
    jobStatus: apisStatusConstants.initial,
    searchInput: '',
    employmentList: [],
    salaryRange: '',
    jobsData: [],
  }

  componentDidMount() {
    this.getProfile()
    this.getAllJobs()
  }

  onEnterKey = event => {
    if (event.key === 'Enter') {
      this.getAllJobs()
    }
  }

  onChangeEmployment = event => {
    const {employmentList} = this.state

    if (employmentList.includes(event.target.id)) {
      const updateList = employmentList.filter(each => each !== event.target.id)
      this.setState({employmentList: updateList}, this.getAllJobs)
    } else {
      this.setState(
        prevState => ({
          employmentList: [...prevState.employmentList, event.target.id],
        }),
        this.getAllJobs,
      )
    }
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.id}, this.getAllJobs)
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  convertCamelcase = obj => ({
    name: obj.name,
    profileImageUrl: obj.profile_image_url,
    shortBio: obj.short_bio,
  })

  converCamelcaseOfJob = obj => ({
    companyLogoUrl: obj.company_logo_url,
    employmentType: obj.employment_type,
    id: obj.id,
    jobDescription: obj.job_description,
    location: obj.location,
    packagePerAnnum: obj.package_per_annum,
    title: obj.title,
    rating: obj.rating,
  })

  getProfile = async () => {
    this.setState({pageStatus: apisStatusConstants.in_progress})

    const profileUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(profileUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const updateData = this.convertCamelcase(data.profile_details)
      this.setState({
        profile: updateData,
        pageStatus: apisStatusConstants.success,
      })
    } else {
      this.setState({pageStatus: apisStatusConstants.failure})
    }
  }

  profileSuccessView = () => {
    const {profile} = this.state
    return (
      <div className="profile-section">
        <img
          src={profile.profileImageUrl}
          alt="profile"
          className="profile-logo"
        />
        <h1 className="name">{profile.name}</h1>
        <p>{profile.shortBio}</p>
      </div>
    )
  }

  profileLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  profileFailureView = () => (
    <button className="retry-btn" type="button" onClick={this.getProfile}>
      Retry
    </button>
  )

  getProfileDetails = () => {
    const {pageStatus} = this.state
    switch (pageStatus) {
      case apisStatusConstants.success:
        return this.profileSuccessView()
      case apisStatusConstants.in_progress:
        return this.profileLoaderView()
      case apisStatusConstants.failure:
        return this.profileFailureView()
      default:
        return null
    }
  }

  getAllJobs = async () => {
    this.setState({jobStatus: apisStatusConstants.in_progress})

    const {employmentList, salaryRange, searchInput} = this.state
    const type = employmentList.join(',')
    console.log(type)

    const jobUrl = `https://apis.ccbp.in/jobs?employment_type=${type}&minimum_package=${salaryRange}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobUrl, options)
    if (response.ok === true) {
      const data = await response.json()
      const updateData = data.jobs.map(each => this.converCamelcaseOfJob(each))
      this.setState({
        jobsData: updateData,
        jobStatus: apisStatusConstants.success,
      })
    } else {
      this.setState({jobStatus: apisStatusConstants.failure})
    }
  }

  getApi = () => {
    this.getAllJobs()
  }

  noJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs"
      />
      <div className="no-jobs-text">
        <h1 className="no-jobs-heading">No jobs found</h1>
        <p className="no-jobs-para">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    </div>
  )

  jobSuccessView = () => {
    const {jobsData} = this.state

    return (
      <div className="result">
        {jobsData.length === 0 ? (
          this.noJobsView()
        ) : (
          <ul className="job-list">
            {jobsData.map(each => (
              <JobItem jobDetails={each} key={each.id} />
            ))}
          </ul>
        )}
      </div>
    )
  }

  jobLoaderView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  jobFailureView = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <div className="failure-text">
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-para">
          we cannot seem to find the page you are looking for.
        </p>
        <button className="retry-btn" type="button" onClick={this.getApi}>
          Retry
        </button>
      </div>
    </div>
  )

  getJobsView = () => {
    const {jobStatus} = this.state
    switch (jobStatus) {
      case apisStatusConstants.in_progress:
        return this.jobLoaderView()
      case apisStatusConstants.success:
        return this.jobSuccessView()
      case apisStatusConstants.failure:
        return this.failureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main">
        <Header />
        <div className="jobs-container">
          <div className="bottom-section">
            <div className="left-side">
              <div className="search-small">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  onChange={this.onChangeSearch}
                  onKeyDown={this.onEnterKey}
                />
                <button
                  data-testid="searchButton"
                  type="button"
                  className="search-btn"
                  onClick={this.getAllJobs}
                >
                  <AiOutlineSearch className="search-icon" />
                </button>
              </div>
              <div className="profile-container">
                {this.getProfileDetails()}
              </div>
              <hr className="hr-line" />
              <h1 className="category-heading">Type of Employment</h1>
              <ul className="categories">
                {employmentTypesList.map(each => (
                  <li className="line" key={each.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={each.employmentTypeId}
                      onChange={this.onChangeEmployment}
                    />
                    <label htmlFor={each.employmentTypeId} className="label">
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
              <hr className="hr-line" />
              <h1 className="category-heading">Salary Range</h1>
              <ul className="categories">
                {salaryRangesList.map(each => (
                  <li className="line" key={each.salaryRangeId}>
                    <input
                      type="radio"
                      id={each.salaryRangeId}
                      name="salary"
                      onChange={this.onChangeSalaryRange}
                    />
                    <label htmlFor={each.salaryRangeId} className="label">
                      {each.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div className="right-side">
              <div className="search">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  onChange={this.onChangeSearch}
                  onKeyDown={this.onEnterKey}
                />
                <button
                  data-testid="searchButton"
                  type="button"
                  className="search-btn"
                  onClick={this.getAllJobs}
                >
                  <AiOutlineSearch className="search-icon" />
                </button>
              </div>
              {this.getJobsView()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default JobRoute
