export class Timer {
    now(): number {
        return Date.now();
    }

    isMidnight() {
        return new Date().getHours() === 0 && new Date().getMinutes() === 0;
    }

    setInterval(action: any, interval: number) {
        return setInterval(action, interval);
    }
}
