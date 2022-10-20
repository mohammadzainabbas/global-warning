from os import system
from subprocess import CalledProcessError
from random import choice
from time import sleep, time

commit_messages = ['Minor update', 'Minor', 'Work in progress', 'Minor change', 'Updated code', 'Minor changes']
push_after = 20 # in seconds

def print_log(text: str) -> None: print("[[ log ]] {}".format(text))
def print_error(text: str) -> None: print("[[ error ]] {}".format(text))

def run_bash_script(command=None, verbose=True):
    """
    Runs a bash script and returns if script was successfully executed or not
    """
    if isinstance(command, str):
        try:
            if verbose: print_log("Running '{}'".format( command ))
            start_time = time()
            system( command )
            if verbose: print_log("Took {} seconds to run '{}'".format( time() - start_time, command ))
            return True;
        except CalledProcessError:
            if verbose: print_error("Something went wrong with {}".format( command ))
            return False;
    else:
        if verbose: print_error("Bash command should be passed as a string")
        return False;

def add_to_git():
    success = run_bash_script("sh commit.sh '{}'".format( choice(commit_messages) ))
    if not success: print_error("Something went wrong when push the code")

def main():
    """
    Continuously push code to github
    """
    while(True):
        add_to_git()
        sleep(push_after)

if __name__ == "__main__":
    main()
