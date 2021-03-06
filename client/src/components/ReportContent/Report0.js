import React from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, PDFViewer, Image } from '@react-pdf/renderer';
import ReactDOM from 'react-dom';
import page3 from '../pg_0003.jpg';
import header1 from '../header1.jpg';
import footer1 from '../footer1.jpg';
import header2 from '../header2.jpg';
import footer2 from '../footer2.jpg';
// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: 'white'
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    view: {
        width: '100%',
        height: '100%',
        padding: 0,
        backgroundColor: 'white',
    },
    image: {
        objectFit: 'cover'
    },
    tableRow: {
        flex: 1,
        marginLeft : '5%',
        flexDirection : 'row',
        marginBottom : '6px'
    },
    tableRowHead: {
        flex: 1,
        marginLeft : '5%',
        flexDirection : 'row',
        marginTop : '4%'
    },
    tableColLeft: {
        borderStyle: "solid",
        borderWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        display : 'inline-block',
        width : '60%',
        float : 'left',
        flexDirection : 'column',
        color : 'grey',
        fontSize : 10,
        textAlign : 'left'
    },
    tableColRight: {
        borderStyle: "solid",
        borderWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        display : 'inline-block',
        width : 'auto',
        float : 'left',
        flexDirection : 'column',
        color : 'grey',
        fontSize : 10,
        marginRight : '3%',
        textAlign : 'left'
    },
    tableColRightHead: {
        borderStyle: "solid",
        borderWidth: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        display : 'inline-block',
        float : 'right',
        flexDirection : 'column',
        color : 'grey',
        fontSize : 10,
        marginLeft : 'auto'
    }
});

class Report extends React.Component {
    constructor(props) {
        super(props);
        console.log('props are ', this.props);
    }

    getDateInFormat(){
        var today = new Date();
        var dd = today.getDate();

        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        if(dd<10)
        {
            dd='0'+dd;
        }

        if(mm<10)
        {
            mm='0'+mm;
        }
        return today = mm+'/'+dd+'/'+yyyy;

    }


    render() {

        return (
            <Document>
                <Page object-fit="fill" size="A4">
                    {/*<View style={{
                        width : '100%',
                        height: '18%',
                        padding : 0,
                        backgroundColor : 'white',
                        marginBottom : 0
                        }}>
                        <Image style={styles.image}  src={header1} alt="images" />
                        </View>
                        */}
                        <View style= {{
                            }}>

                            <View style= {styles.tableRowHead}>
                                <Text style={styles.tableColLeft}> Date : {this.getDateInFormat()} </Text>
                                <Text style={styles.tableColRightHead}>{'                            1'} </Text>
                            </View>
                            <Text style={{
                                    margin : 'auto',
                                    alignItems : 'center',
                                    marginTop : '1%',
                                    color : 'blue',
                                    marginBottom : '2%',
                                    fontSize : 26,
                                }}>
                                {this.props.data.player_id}
                            </Text>

                            <View style={styles.tableRow}>



                                <Text style={styles.tableColLeft}> DOB : {this.props.user.dob ? this.props.user.dob : "N/A"} </Text>
                                <Text style={styles.tableColRight}> Referring physician : Dr. Jane Doctor </Text>

                            </View>
                            <View style={styles.tableRow}>

                                <Text style={styles.tableColLeft}> Sex : {this.props.user.gender ? this.props.user.gender.toUpperCase() : "N/A"} </Text>

                                <Text style={styles.tableColRight}> Organization : {this.props.team != undefined ? this.props.team.organization : this.props.user.organization ? this.props.user.organization : "N/A" } </Text>

                            </View>
                        </View>

                        {/* <View style={{
                            width : '100%',
                            padding : 0,
                            backgroundColor : 'white',
                            marginBottom : '10'
                            }}>
                            <Image style={styles.image}  src={footer1} alt="images" />
                            </View>
                            */}


                        </Page>
                        <Page object-fit="fill" size="A4">
                            <View>
                                <View style= {styles.tableRowHead}>

                                    <Text style={styles.tableColRightHead}>{'                            2'} </Text>
                                </View>
                                <Text style = {{
                                        fontSize : 15,
                                        textAlign : 'center',
                                        color : "#0E263D",
                                        marginTop : '2%',
                                        marginBottom : '2%'
                                    }}>NSFCAREER OVERVIEW</Text>
                                    <View style= {{

                                        }}>


                                        <View style={styles.tableRow}>



                                            <Text style={styles.tableColLeft}> DOB : {this.props.user.dob ? this.props.user.dob : "N/A"} </Text>
                                            <Text style={styles.tableColRight}> Referring physician : Dr. Jane Doctor </Text>

                                        </View>
                                        <View style={styles.tableRow}>

                                            <Text style={styles.tableColLeft}> Sex : {this.props.user.gender ? this.props.user.gender.toUpperCase() : "N/A"} </Text>

                                            <Text style={styles.tableColRight}> Organization : {this.props.team != undefined ? this.props.team.organization : this.props.user.organization ? this.props.user.organization : "N/A" } </Text>

                                        </View>
                                    </View>
                                </View>

                                {/*<View style={{
                                    width : '100%',
                                    height: '18%',
                                    padding : 0,
                                    backgroundColor : 'white',
                                    marginBottom : 0
                                    }}>

                                    <Image style={styles.image}  src={header2} alt="images" />
                                    </View>


                                    <View style= {{
                                    marginBottom : '12px'
                                    }}>
                                    <View style={styles.tableRow}>

                                    <Text style={styles.tableColLeft}> DOB: 14/82/1264 </Text>


                                    <Text style={styles.tableColRight}> Referring physician : Dr. Jane Doctor </Text>

                                    </View>
                                    <View style={styles.tableRow}>

                                    <Text style={styles.tableColLeft}> Patient ID : 1452462 </Text>

                                    <Text style={styles.tableColRight}> Organization : York Technical High School </Text>

                                    </View>
                                    </View>
                                    <View style={{
                                    width : '100%',
                                    padding : 0,
                                    backgroundColor : 'white'
                                    }}>
                                    <Image style={styles.image}  src={footer2} alt="images" />
                                    </View>
                                    */}

                                </Page>
                            </Document>
                        );

                    }

                }








                export default Report;
