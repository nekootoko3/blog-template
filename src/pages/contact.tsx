import Layout from "../components/layout";
import styled from "styled-components";

const contacts: { icon: string; link: string }[] = [
  {
    icon: "/images/github.png",
    link: "https://github.com/nekootoko3",
  },
  {
    icon: "/images/twitter.png",
    link: "https://twitter.com/nekootoko3",
  },
];

export default () => {
  return (
    <Layout>
      <ContactList>
        {contacts.map((contact) => {
          return (
            <ContactItem>
              <a href={contact.link}>
                <Icon src={contact.icon} />
              </a>
            </ContactItem>
          );
        })}
      </ContactList>
    </Layout>
  );
};

const ContactList = styled.div`
  display: flex;
  justify-content: center;
`;

const ContactItem = styled.div`
  margin-left: 1rem;
`;

const Icon = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
`;
