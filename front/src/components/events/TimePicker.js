import './TimePicker.css';

import { Select } from 'antd';

import * as dayjs from 'dayjs';

var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone'); // dependent on utc plugin
dayjs.extend(utc);
dayjs.extend(timezone);

function TimePicker(props) {
    const { Option } = Select;
    let readableTime = dayjs().startOf('day');
    let timeChunks = [];
    let timeChunk = [];

    const amountOfChunks = 96; //24 hours * 60 minutes / 15 minutes
    const chunkDuration = 15; //minutes

    for (let minutes = 0; minutes < amountOfChunks * chunkDuration; minutes = minutes + chunkDuration) {
        timeChunk = {
            minutes: minutes,
            readableTime: readableTime.add(minutes, 'minute'),
        }
        timeChunks.push(timeChunk);
    }

    let date = dayjs(props.date).tz("UTC");
    // let defaultValue = date.diff(date.utc(true).startOf('date')) / 60000;
    let defaultValue = date.diff(date.startOf('date')) / 60000;

    return (
        <Select defaultValue={defaultValue} className='input--background-on-hover time-picker--select' dropdownMatchSelectWidth={false} bordered={props.bordered} showArrow={props.showArrow}>
            {
                timeChunks.map((chunk, index) => {
                    return (
                        <Option value={chunk.minutes} key={chunk.minutes}>
                            {chunk.readableTime.format('h:mm a')}
                        </Option>
                    );
                })
            }
        </Select>
    );
}

export default TimePicker;