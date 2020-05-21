import React, { Fragment } from "react";
import { useAuth0 } from "../../../react-auth0-spa";
import { LinkedButton } from "../../components/shared/links";
import { useTitle } from "hookrouter";
import PageTitle from "../../components/shared/page-title";
import PageWrapper from "../../components/shared/page-wrapper";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Typography from "@material-ui/core/Typography";
import PageTitle2 from "../../components/shared/page-title-2";
import MarkdownListItem from "../../components/top-level/home/markdown-list-item";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";

// const useStyles = makeStyles(() => ({
//     buttonGroup: {
//         display: "flex",
//         flexFlow: "row wrap",
//         justifyContent: "flex-start",
//         alignItems: "center",
//
//         "& > *": {
//             margin: "4px"
//         }
//     },
// }));

const HomePage = () => {
    useTitle("Home - quotracker");
    // const classes = useStyles();
    const {isAuthenticated, loginWithRedirect, user} = useAuth0();

    const isLoggedInPage = (
        <Fragment>
            <PageTitle title={`Hallo, ${user?.given_name ? user?.given_name : user?.name}!`}/>
            <LinkedButton variant="contained" color="primary" href={"/alltargets"}>ZU DEINEN TARGETS</LinkedButton>

            <p/>

            <Alert variant="standard" severity="warning">
                <AlertTitle>Hinweis</AlertTitle>
                Aufgrund der aktuellen Serverkonfiguration kann es bei erstmaligem Drücken auf <Typography
                variant="button">Zu deinen Targets</Typography> zu <strong>Ladezeiten von 10 bis 20
                Sekunden</strong> kommen, bitte hab Geduld. Falls doch ein Fehler auftreten sollte, bitte die Seite
                einmal neu laden.
            </Alert>

            <p/>

            <Typography variant="body1">
                Willkommen bei quotracker, die App, um die Floskeln deiner Profs und Lehrer zu tracken und zu schauen,
                wann und wie oft sie diese sagen. Klick einfach auf <Typography variant="button">Zu deinen
                Targets</Typography>, um loszulegen, oder mach dich erstmal mit den Begriffen vertraut.
            </Typography>
        </Fragment>
    );

    const notLoggedInPage = (
        <Fragment>
            <PageTitle title="quotracker"/>
            <Typography variant="subtitle1"><i>...Track die Sprüche deiner Profs und Lehrer...</i></Typography>

            <Typography variant="body1" gutterBottom>
                Willkommen bei quotracker, die App, um die Floskeln deiner Profs und Lehrer zu tracken und zu schauen,
                wann und wie oft sie diese sagen. Melde dich an oder registriere dich, um loszulegen, oder mach dich
                erstmal mit den Begriffen und der Geschichte von quotracker vertraut.
            </Typography>

            <br/>

            <Button variant="contained" color="primary" onClick={() => loginWithRedirect()}>Anmelden /
                Registrieren</Button>
        </Fragment>
    );

    const generalPage = (
        <Fragment>
            <PageTitle2 title="Begriffe"/>
            <ul>
                <MarkdownListItem term="Spruch">
                    Versteht sich von selbst:
                    <i>Eine Floskel/ein Satz(-teil), den dein Prof oder Lehrer häufig sagt, z. B. "Verstehen Sie?"</i>
                </MarkdownListItem>
                <MarkdownListItem term="Target">
                    Ein Target bei quotracker ist eine Person oder Gruppe an Personen, deren Sprüche du tracken
                    möchtest. Du kannst so viele Targets anlegen, wie du willst. Du kannst deine Freunde zu deinen
                    Targets hinzufügen, dann könnt ihr gemeinsam Sprüche eintragen.
                </MarkdownListItem>
                <MarkdownListItem term="Record">
                    Ein Record wird angelegt, wenn dein Prof/Lehrer einen Spruch sagt und du auf den entsprechenden
                    Button klickst. Wenn du aus Versehen auf einen Button geklickt hast, kannst du den dadurch
                    entstandenen Record für eine kurze noch wieder löschen.
                </MarkdownListItem>
            </ul>

            <PageTitle2 title="Geschichte"/>
            <Typography variant="body1" gutterBottom>
                Die Idee für eine solche App kam im 3. Semester meines Studiums auf. Wir hatten einen Prof, der extrem
                häufig "Verstehen Sie?" oder "Verstehen Sie das?" sagte. Nachdem wir eine Strichliste geführt hatten und
                er diesen Spruch 45 mal in 90 Minuten gesagt hatte, beschlossen wir, eine kleine Webseite zu schreiben.
                Diese hätte für jeden Spruch einen Button und beim Drücken würde in einer Datenbank ein Datensatz mit
                dem Spruch und der aktuellen Zeit angelegt werden. Gesagt getan, ich schrieb mit HTML und PHP eine
                kleine, ganz einfache Webseite und in der nächsten Vorlesung drückten wir fleißig auf die Buttons.
            </Typography>

            <Typography variant="body1" gutterBottom>
                Später führten wir dann noch eine weitere Seite ein, die automatisch die Datensätze aus der Datenbank
                lud und als Diagramm darstellte. Einige Wochen später kam dann auch noch eine Live-Statistik dazu, aber
                um mehr erweiterte ich die wirklich grauenvoll geschriebene Seite nicht.
            </Typography>

            <Typography variant="body1" gutterBottom>
                In den Semesterferien, zwischen den Klausuren im Wintersemester 2019/20 und dem Beginn des
                Sommersemesters 2020, begann ich während des Corona-Lockdowns die Webseite als App neu zu schreiben, da
                es von mehreren Seiten Interesse an einer solchen App gab. Dieses mal würde ich allerdings eine Web-App
                realisieren, bestehend aus Backend-Server und dieser Frontend-App. Und genau dort sind wir gerade.
            </Typography>

            <br/>

            <Typography variant="h5" component="h3">Für die Technik-interessierten</Typography>
            <ul>
                <MarkdownListItem term="Server">
                    geschrieben in Kotlin mit <Link href="https://ktor.io/">ktor</Link> und <Link
                    href="https://github.com/JetBrains/Exposed">Jetbrains Exposed</Link>
                </MarkdownListItem>
                <MarkdownListItem term="App">
                    geschrieben in Javascript mit <Link href="https://reactjs.org/">React</Link> und vielen
                    kleineren Packeten.
                </MarkdownListItem>
            </ul>
        </Fragment>
    );

    const header = isAuthenticated ? isLoggedInPage : notLoggedInPage;

    return (
        <PageWrapper>
            {header}
            {generalPage}
        </PageWrapper>
    );
};

export default HomePage;