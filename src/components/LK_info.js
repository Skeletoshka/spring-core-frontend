const LK_Info = (source) => {
    if(source.people !== undefined && source.people.peopleName !== null){
        return(
            <div className="personInfo">
                {source.people.peopleLastName} {source.people.peopleName} {source.people.peopleMiddleName} <br/>
                {source.people.peopleEmail} {source.people.peopleDateBirth} 
            </div>
        )
    }else{
        return(
            <div className="personInfo">
                <h1>У вас нет связи с человеком</h1>
            </div>
        )
    }
}
export default LK_Info;