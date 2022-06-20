import { booleanArg, extendType, intArg, nonNull, nullable, objectType, stringArg } from "nexus";
import { NexusGenObjects } from "../../../nexus-typegen"; 

export const FlashCard = objectType({
    name: "FlashCard", 
    definition(t) {  
        t.nonNull.int("id"); 
        t.nonNull.string("title");
        t.nonNull.string("question");
        t.nonNull.string("answer");   
        t.nonNull.boolean("isDone"); 
        t.field("flashcardMaker", {
            type: "Users",
            resolve(parent, args, context) {
                return context.prisma.flashcard 
                     .findUnique({where: { id: parent.id }})
                     .flashcardMaker();
            }
        });
    },
});

export const flashCardQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("get_All_Cards",{
            type:"FlashCard",
            resolve(parent, args, context){
                return context.prisma.flashcard.findMany();
            }
        })
    }
})


export const flashCardMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("Post_flashCardFeed", {   // 3
            type: "FlashCard",
            args: {
               title: nonNull(stringArg()),
               question: nonNull(stringArg()),
               answer: nonNull(stringArg()),
            },
            resolve(parent, args, context) {    // 4
                const { title, question, answer } = args;
                const { userId } = context;

                if(!userId){
                    throw new Error("please login to continue!")
                }

                const newFlashCard = context.prisma.flashcard.create({
                    data: {
                        title: title,
                        question: question,
                        answer: answer,
                        flashcardMaker: { connect: { id: userId}},
                    }
                });
                return newFlashCard;
            },
        });

        t.nonNull.field('updateFlashCard', {
            type: "FlashCard",
            args: {
                title: nullable(stringArg()),
                question: nullable(stringArg()),
                answer: nullable(stringArg()),
                isDone: nullable(booleanArg()),
                id: nonNull(intArg())
            },
            resolve(parent, args, context){
                const { title, question, answer,isDone, id } = args;
                const { userId } = context;

                if(!userId){
                    throw new Error("please login to update the flashCard!")
                }

                const newFlashCard = context.prisma.flashcard.update({
                    where:{id},
                    data: {
                        ...(title && { title }),
                        ...(question && { question }),
                        ...(answer && { answer }),
                        ...(isDone !== null && { isDone })
                    }
                });
                return newFlashCard;
            },
        });

        t.nonNull.field("deleteFlashCard", {
            type: "FlashCard",
            args: {
                id: nonNull(intArg())
            },
           resolve(parent, args, context){
                const {id } = args;
                const { userId } = context;

                if(!userId){
                    throw new Error("please login to delete the flashCard!")
                }

                return context.prisma.flashcard.delete({
                    where:{id},
                });
            },
        });
    }
})