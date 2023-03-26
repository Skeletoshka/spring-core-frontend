const LK_Info = (source) => {
    return(
        <div className="personInfo">
            {source.people.peopleLastName} {source.people.peopleName} {source.people.peopleMiddleName} <br/>
            {source.people.peopleEmail} {source.people.peopleDateBirth} 
        </div>
    )
}
export default LK_Info;