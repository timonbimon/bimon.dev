FROM gitpod/workspace-full

# Install custom tools, runtimes, etc.
# For example "bastet", a command-line tetris clone:
# RUN brew install bastet
#
# More information: https://www.gitpod.io/docs/config-docker/
RUN git clone https://github.com/timonbimon/dotfiles .dotfiles
RUN ls -al
RUN whoami
RUN pwd
RUN cat /home/gitpod/.zshrc
RUN rm /home/gitpod/.zshrc
RUN /home/gitpod/.dotfiles/install
RUN /home/gitpod/.dotfiles/brew.sh