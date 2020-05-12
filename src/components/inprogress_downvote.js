import React from "react";
import { graphql } from "react-apollo";
import { gql } from "apollo-boost";
import Modal from 'react-modal';
import "./GettingGraphQLData.css";
import { useMutation } from '@apollo/react-hooks';
const GET_USER_INFO = gql`
	{
		manager(where : { id: { _eq: "077b5f62-936e-11ea-bb37-0242ac130002" }}) {
			id
    		firstname
    		password
    		feedback_status
			profiles(
				where: { managerid: { _eq: "077b5f62-936e-11ea-bb37-0242ac130002" } }
			) {
				id
      			name
      			password
      			feedback
      			username
			}
		}
	}
`;

const UPDATE_MEMBER_FEEDBACK = gql`
mutation Update_Profile($id: Int, $status:String){
	update_profile(where: {
	  id : {_eq:$id}
	},_set:{
	  feedback : {status : $status }
  
	}){
	  _affected_rows
	}
  }
`;

const GettingGraphQLData = (props) => {
	const [manager,setManager] = React.useState(null);
	const [showModal,setShowModal] = React.useState(false);
	const [currentMember,setCurrentMember] = React.useState(null);
	const [update_profile, { data }] = useMutation(UPDATE_MEMBER_FEEDBACK);
	const reviewValue = React.useRef();

	React.useEffect(() => {	

		console.log(props.data)
		if(props.data.manager !== undefined && manager == null){
			console.log("Worked",props.data.manager[0]);
			setManager(props.data.manager[0])
		}
	});

	if(manager === null){
		return "Loading...";
	}

	const customStyles = {
		content : {
		  top                   : '30%',
		  left                  : '50%',
		  right                 : '20%',
		  bottom                : '30%',
		  marginRight           : '-20%',
		  transform             : 'translate(-50%, -50%)'
		}
	  };

	// @ts-ignore
	const handleFeedback = (eventClick,member) => {
		console.log(eventClick);
		setCurrentMember(member)
		if(eventClick !== "up"){
			if(member.feedback.status === "null"){
				setShowModal(true);
			}
			
		}
		else{
			update_profile({variables : {id : "4",status : "Very Good"}});
		}
		
	} 

	const handleReview = () => {
		const value = reviewValue.current.value;
		console.log(value);
		setShowModal(false);
		update_profile({variables : {id: "4", status : reviewValue.current.value}});
	}

	console.log(typeof(manager), "---",manager[0]);
	return (
		<>
			<div className="container">
				
				<div className="manager-profile">
					<h2>Manager's Profile</h2>
					<h3>Name : {props.data.manager[0].firstname}</h3>
					<h3>Id : {props.data.manager[0].id}</h3>
				</div>
				
				<h2>Team Members'</h2>
				{manager.profiles.map((member) => {
					console.log(member);
					return (
						<div className="member-profile" key={member.id}>
							<h4>Name: {member.name}</h4>
							<span>Username: {member.username}</span>
							&nbsp;
					<span>Id: {member.id}</span>
							<p>Feedback : {member.feedback.status !== "null" ? member.feedback.status : "Not Given"}</p>
					<button onClick={() => handleFeedback("up",member)}>{member.feedback.status !== "null" ? <i className="fa fa-thumbs-up" style={{"fontSize":"48px"}}></i> : <i className="fa fa-thumbs-o-up" style={{"fontSize":"48px"}}></i>}</button> &nbsp;
						<button onClick={() => handleFeedback("down",member)}><i className="fa fa-thumbs-o-down" style={{"fontSize":"48px"}}></i></button>
						</div>
					)
				})}

				<Modal 
				isOpen={showModal}
				style={customStyles}
				contentLabel="Minimal Modal Example"
				>
					<h2>Review for {currentMember?.name}</h2>
					<textarea  ref={reviewValue} placeholder="Right review for Team member" rows="6" cols="80"/>
					<br/>
					<button onClick={handleReview}>submit</button>
				</Modal>
			</div>
		</>
	);
};
export default graphql(GET_USER_INFO)(GettingGraphQLData);
