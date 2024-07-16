export class Metrics {
    criterion_1: number;
    comment_criterion_1: string;
    criterion_2: number;
    comment_criterion_2: string;
    criterion_3: number;
    comment_criterion_3: string;
    criterion_4: number;
    comment_criterion_4: string;

    constructor(
        criterion_1: number,
        comment_criterion_1: string,
        criterion_2: number,
        comment_criterion_2: string,
        criterion_3: number,
        comment_criterion_3: string,
        criterion_4: number,
        comment_criterion_4: string
    ) {
        this.criterion_1 = criterion_1;
        this.comment_criterion_1 = comment_criterion_1;
        this.criterion_2 = criterion_2;
        this.comment_criterion_2 = comment_criterion_2;
        this.criterion_3 = criterion_3;
        this.comment_criterion_3 = comment_criterion_3;
        this.criterion_4 = criterion_4;
        this.comment_criterion_4 = comment_criterion_4;
    }
}