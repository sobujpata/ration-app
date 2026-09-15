export default function Footer() {
    return (
        <footer className="border-border/60 text-muted-foreground w-full border-t">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-6 text-sm lg:px-8">
                <span>Ration App</span>
                <span>© {new Date().getFullYear()} All rights reserved.</span>
            </div>
        </footer>
    );
}
