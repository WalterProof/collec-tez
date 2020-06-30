FROM ekino/ci-tezosqa:0.1-latest

# non-root user
ARG USERNAME=ek
ARG UID=1000
ARG GID=$UID

RUN apt-get update -q -y && apt-get install -q -y sudo && \
  apt-get -q -y autoremove && \
  apt-get -q -y clean && apt-get -q -y purge && \
  rm -rf /var/lib/apt/lists/* /var/lib/dpkg/*-old && \
  # non-root user for dev
  groupadd --gid ${GID} ${USERNAME} && \
  useradd --uid ${UID} --gid ${GID} ${USERNAME} -s /bin/bash && \
  mkdir /home/${USERNAME} && \
  chown ${USERNAME}:${USERNAME} /home/${USERNAME} && \
  usermod -aG sudo ${USERNAME} && \
  echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

WORKDIR /home/ek
