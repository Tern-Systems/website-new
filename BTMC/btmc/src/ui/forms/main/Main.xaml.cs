using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace btmc
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private enum _TabEnum { BTMC, TERN };
        private _TabEnum _activeTab = _TabEnum.BTMC;

        public MainWindow()
        {
            InitializeComponent();
            DataContext = this;
        }

        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ButtonState == MouseButtonState.Pressed)
                DragMove();
        }

        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void BtnMinimize_Click(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }

        private void TcMain_SectionChanged(object sender, RoutedEventArgs e)
        {
            /* Uncomment after you add your custom TabControl to the form */
            //_activeTab = (_TabEnum)tcMain.SelectedIndex;
        }

        private void BtnClean_Click(object sender, RoutedEventArgs e)
        {
            switch (_activeTab)
            {
                default: break;
                case _TabEnum.BTMC:
                    // Implement it
                    break;
                case _TabEnum.TERN:
                    // Implement it
                    break;
            }
        }

        private void BtnConvert_Click(object sender, RoutedEventArgs e)
        {
            switch (_activeTab)
            {
                default: break;
                case _TabEnum.BTMC:
                    // Do not implement
                    break;
                case _TabEnum.TERN:
                    // Do not implement
                    break;
            }
        }

        private void GenderComboBox_SelectionChanged(object sender, System.Windows.Controls.SelectionChangedEventArgs e)
        {

        }

        private void Submit_Click(object sender, RoutedEventArgs e)
        {
            string name = NameTextBox.Text;
            string email = EmailTextBox.Text;
            string gender = (GenderComboBox.SelectedItem as ComboBoxItem)?.Content.ToString();
            string dob = DobPicker.SelectedDate?.ToShortDateString();

            MessageBox.Show($"Submitted:\nName: {name}\nEmail: {email}\nGender: {gender}\nDOB: {dob}");

        }
    }
}
