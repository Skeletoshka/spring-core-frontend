const LK_Info = (source) => {
    return(<div className={"lk_card"}>
        <div className={"name_lk"}>Имя пользователя: {localStorage.getItem("progUserName")}</div>
        <div className={"name_people"}>Имя владельца УЗ: {source.people!==null&&source.people!==undefined?
            (source.people.peopleLastName + " " + source.people.peopleName + " "
                + source.people.peopleMiddleName):"Пользователь ни с кем не связан"}</div>
        <div className={"name_people"}>Дата рождения владельца УЗ: {source.people!==null&&source.people!==undefined?
            (new Date(source.people.peopleDateBirth).toLocaleDateString()):"Пользователь ни с кем не связан"}</div>
    </div>)
}
export default LK_Info;