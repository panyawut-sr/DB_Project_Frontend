import React, { Component } from 'react'
import { Table, Button, MenuItem, DropdownButton } from 'react-bootstrap'
import styled from 'styled-components'
import axios from 'axios'

import { MOCK_SUBJECTS } from './MockData.json'

const API_URL = 'http://localhost:3006/studentCourse'

const ViewSubjectBox = styled.div`
    border:1px solid lightgrey;
    padding:10px;
`;

const ViewSubjectTable = styled.div`
    width:100wh;
    max-height:100vh;
    overflow-y:scroll;
`;

const withdrawButtonText = 'ถอน'

function getSemester(subject) {
    return subject.year + '/' + subject.semester;
}

function loadSubjects(subjects) {
    var sems = [...new Set(subjects.map((obj, idx) => getSemester(obj)))].sort((a, b) => (a === b ? 0 : a < b ? 1 : -1))
    var latestSem = sems[0]
    return {
        semesters: sems,
        subjects: subjects,
        currSem: latestSem,
        latestSem: latestSem
    }
}

export default class ViewSubjectsAll extends Component {
    constructor(props) {
        super(props)
        var username = '5208389731'
        // var username = this.props.usernameLog
        // axios.get(API_URL, {params: {studentID: username}})
        //     .then((response) => this.setState(loadSubjects(response.data.data)))
        //     .catch((error) => console.log(error))
        this.state = loadSubjects(MOCK_SUBJECTS)
        
        this.onWithdrawButton = this.onWithdrawButton.bind(this)
    }

    onWithdrawButton(subject) {  
        if(window.confirm("ถอนรายวิชา " + subject.subjectID + " " + subject.subjectName + "?"))
        {
            window.alert("TODO: Withdraw Subject")
        }
    }

    render() {
        return (
            <div>
                <h1>{this.props.nameLog} {this.props.usernameLog}</h1>
                <ViewSubjectBox>
                    <DropdownButton title={this.state.currSem} id='semesterDropdown'>
                        {this.state.semesters.map((obj, index) => (
                            <MenuItem
                                eventKey={index}
                                onClick={() => { this.setState({ currSem: obj }) }}
                            >
                                {obj}
                            </MenuItem>
                        ))}
                    </DropdownButton>
                    <ViewSubjectTable>
                        <Table bordered condensed hover responsive>
                            <thead>
                                <tr>
                                    <th>วิชา</th>
                                    <th>ตอนเรียน</th>
                                    <th>เวลาเรียน</th>
                                    <th>สถานที่</th>
                                    <th>อาจารย์ผู้สอน</th>
                                    <th>ผลการเรียน</th>
                                    {
                                        this.props.canWithdraw &&
                                        <th />
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.subjects
                                    .filter((item) => (getSemester(item) === this.state.currSem))
                                    .map((obj, index) => (
                                        <tr>
                                            <td>{obj.subjectID} {obj.subjectName}</td>
                                            <td>{obj.detail.sec}</td>
                                            <td>{obj.detail.time.map((x, idx) => <span key={idx}>{x.day} {x.time}<br /></span>)}</td>
                                            <td>{obj.detail.time.map((x, idx) => <span key={idx}>{x.roomID} {x.buildingID}<br /></span>)}</td>
                                            <td>{obj.detail.teacher.map((x, idx) => <span key={idx}>{x}<br /></span>)}</td>
                                            <td>{obj.grade}</td>
                                            {
                                                this.props.canWithdraw &&
                                                <td>
                                                    <Button
                                                        bsStyle='danger'
                                                        bsSize='xsmall'
                                                        onClick={() => this.onWithdrawButton(obj)}
                                                        disabled={this.state.currSem !== this.state.latestSem}
                                                    >
                                                        {withdrawButtonText}
                                                    </Button>
                                                </td>
                                            }
                                        </tr>
                                    ))}
                            </tbody>
                        </Table>
                    </ViewSubjectTable>
                </ViewSubjectBox>
            </div>
        )
    }
}

ViewSubjectsAll.defaultProps = {
    canWithdraw: false
}