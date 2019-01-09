declare namespace jasmine {
    interface Matchers {
        toMatchFileContentsAtPath(filePath: string): boolean;
    }
}