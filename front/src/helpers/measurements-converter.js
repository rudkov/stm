function round10(value) {
    return Math.round(value * 10) / 10;
}

function measurementsConverter(value, to, round=false) {

    if(!value) {
        return;
    }

    let convertedValue;
    switch (to) {
        case 'in':
            convertedValue = value * 0.39370;
            break;

        case 'cm':
            convertedValue = value / 0.39370;
            break;

        case 'ft in':
            const inches = measurementsConverter(value, 'in');
            const int = Math.floor(inches/12);
            const fraction = inches/12 - int;
            convertedValue = int + ' ft ' + round10(fraction * 12) + ' in';
            break;

        case 'lb':
            convertedValue = value * 2.2046;
            break;

        case 'kg':
            convertedValue = value / 2.2046;
            break;

        default:
            break;
    }

    if(round === true) {
        convertedValue = round10(convertedValue);
    }

    return convertedValue;
}

export default measurementsConverter;