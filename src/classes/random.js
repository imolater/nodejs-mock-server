export class Random {
    static integer( min, max ) {
        const random = min + Math.random() * ( max + 1 - min );
        return Math.floor( random );
    }

    static float( min, max ) {
        return min + Math.random() * ( max - min );
    }

    static boolean() {
        return Boolean( Math.round( Math.random() ) );
    }

    static date( start, end, options = {} ) {
        const { isUnix = true } = options;
        const date = new Date( start.getTime() + Math.random() * ( end.getTime() - start.getTime() ) );
        const timestamp = date.getTime();

        return isUnix ? Math.round( timestamp / 1000 ) : timestamp;
    }

    static elem( array, options = {} ) {
        const { returnIndex = false } = options;
        const index = Random.integer( 0, array.length - 1 );

        return returnIndex ? index : array[index];
    }
}
