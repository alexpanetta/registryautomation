export {};

declare global {
    namespace NodeJS { 
        interface ProcessEnv {
            COMPUTERSHARE_USERID: string;
            COMPUTERSHARE_PASS: string;
            COMPUTERSHARE_SEC_QUE_0: string;
            COMPUTERSHARE_SEC_ANS_0: string;
            COMPUTERSHARE_SEC_QUE_1: string;
            COMPUTERSHARE_SEC_ANS_1: string;
            COMPUTERSHARE_SEC_QUE_2: string;
            COMPUTERSHARE_SEC_ANS_2: string;
        }
    }
}
