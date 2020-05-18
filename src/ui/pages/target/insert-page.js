import React from "react";
import { useTitle } from "hookrouter";
import PageWrapper from "../../components/shared/page-wrapper";
import PageTitle from "../../components/shared/page-title";
import BackLink from "../../components/shared/back-link";
import InsertButtonsWrapper from "../../components/target/insert/insert-buttons-wrapper";
import { useStats } from "../../../logic/state-management/api/hooks";

const InsertPage = (props) => {
    useTitle("Eintragen - SLv2");
    // console.log("InsertPage begin");
    const stats = useStats(props.targetId);
    // console.log("InsertPage end");

    // const {loading} = useAuth0();
    // useEffect(() => {
    //     console.log(`--- InsertPage useEffect ${loading}`);
    // }, [loading]);

    return (
        <PageWrapper>
            <PageTitle title="Eintragen"/>
            <BackLink href={"./overview"}/>
            {stats && (
                <InsertButtonsWrapper targetId={props.targetId} quotes={stats.today}/>
            )}
            {/*    find(elem => elem.forTimeframe === "today")*/}
        </PageWrapper>
    );
};

export default InsertPage;

// const useStyles = makeStyles({
//     styledButton: {
//         background: (props) =>
//             props.color === 'red'
//                 ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
//                 : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
//         border: 0,
//         borderRadius: 3,
//         boxShadow: (props) =>
//             props.color === 'red'
//                 ? '0 3px 5px 2px rgba(255, 105, 135, .3)'
//                 : '0 3px 5px 2px rgba(33, 203, 243, .3)',
//         color: 'white',
//         height: 48,
//         padding: '0 30px',
//         margin: 8,
//     }
// });

// const StyledButton = (props) => {
//   const {color, ...other} = props;
//   const classes = useStyles(props);
//   return <Button className={classes.styledButton} {...other}/>;
// };
