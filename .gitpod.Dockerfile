FROM gitpod/workspace-full

# install zsh
RUN sudo apt-get update && \
    sudo apt-get install -y zsh

# configure command-line
RUN git clone https://github.com/timonbimon/dotfiles .dotfiles
RUN rm /home/gitpod/.zshrc
RUN /home/gitpod/.dotfiles/install
RUN yes | . /home/gitpod/.dotfiles/brew.sh