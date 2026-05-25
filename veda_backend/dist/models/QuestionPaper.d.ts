import mongoose, { Document } from 'mongoose';
export type Difficulty = 'Easy' | 'Moderate' | 'Challenging';
export interface IQuestion {
    number: number;
    text: string;
    difficulty: Difficulty;
    marks: number;
    options?: string[];
    answer?: string;
}
export interface ISection {
    title: string;
    sectionType: string;
    instruction: string;
    marksPerQuestion: number;
    questions: IQuestion[];
}
export interface IQuestionPaper extends Document {
    assignmentId: mongoose.Types.ObjectId;
    schoolName: string;
    subject: string;
    grade: string;
    timeAllowed: number;
    maxMarks: number;
    generalInstructions: string;
    sections: ISection[];
    generatedAt: Date;
}
export declare const QuestionPaper: mongoose.Model<{
    subject: string;
    grade: string;
    assignmentId: mongoose.Types.ObjectId;
    schoolName: string;
    timeAllowed: number;
    maxMarks: number;
    generalInstructions: string;
    sections: mongoose.Types.DocumentArray<{
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }> & {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }>;
    generatedAt: NativeDate;
}, {}, {}, {}, mongoose.Document<unknown, {}, {
    subject: string;
    grade: string;
    assignmentId: mongoose.Types.ObjectId;
    schoolName: string;
    timeAllowed: number;
    maxMarks: number;
    generalInstructions: string;
    sections: mongoose.Types.DocumentArray<{
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }> & {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }>;
    generatedAt: NativeDate;
}, {}, {
    toJSON: {
        virtuals: true;
    };
    toObject: {
        virtuals: true;
    };
}> & {
    subject: string;
    grade: string;
    assignmentId: mongoose.Types.ObjectId;
    schoolName: string;
    timeAllowed: number;
    maxMarks: number;
    generalInstructions: string;
    sections: mongoose.Types.DocumentArray<{
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }> & {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }>;
    generatedAt: NativeDate;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    toJSON: {
        virtuals: true;
    };
    toObject: {
        virtuals: true;
    };
}, {
    subject: string;
    grade: string;
    assignmentId: mongoose.Types.ObjectId;
    schoolName: string;
    timeAllowed: number;
    maxMarks: number;
    generalInstructions: string;
    sections: mongoose.Types.DocumentArray<{
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }> & {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }>;
    generatedAt: NativeDate;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    subject: string;
    grade: string;
    assignmentId: mongoose.Types.ObjectId;
    schoolName: string;
    timeAllowed: number;
    maxMarks: number;
    generalInstructions: string;
    sections: mongoose.Types.DocumentArray<{
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }> & {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }>;
    generatedAt: NativeDate;
}>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    toJSON: {
        virtuals: true;
    };
    toObject: {
        virtuals: true;
    };
}>> & mongoose.FlatRecord<{
    subject: string;
    grade: string;
    assignmentId: mongoose.Types.ObjectId;
    schoolName: string;
    timeAllowed: number;
    maxMarks: number;
    generalInstructions: string;
    sections: mongoose.Types.DocumentArray<{
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }> & {
        title: string;
        sectionType: string;
        instruction: string;
        marksPerQuestion: number;
        questions: mongoose.Types.DocumentArray<{
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }, mongoose.Types.Subdocument<mongoose.mongo.BSON.ObjectId, any, {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }> & {
            number: number;
            text: string;
            difficulty: "Easy" | "Moderate" | "Challenging";
            marks: number;
            options: string[];
            answer?: string | null | undefined;
        }>;
    }>;
    generatedAt: NativeDate;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
//# sourceMappingURL=QuestionPaper.d.ts.map